if ( typeof Promise == 'undefined' ) { var _P = require('../lib/promise.min.js').Promise; } else { var _P = Promise; }
var Excp = require('excp.js');
var Session = require('session.js');
var Utils = require('utils.js');


/**
 * 云端指令队列 ( require xpmjs-server 1.0rc4 )
 * 
 * @param  object option 
 * @param  string name 队列名称
 * @return 
 *
 * var que = app.xpm.require('Que', 'hello');
 *		que.select('world').push('create', {  // 增加数据
 *			table:'payout',
 *			data: {
 *				sn:'200193',
 *				order_sn:'test29993',
 *				amount:100,
 *				status:'DONE'
 *			}
 *		}).push('update', { // 更新数据
 *			table:'order',
 *			data: {
 *				sn:'148457330261256',
 *				status_tips:'{{0.sn}} {{0.status}}'
 *			},
 *			unique:'sn'
 *		}).push('app', {   // 调用APP 示例
 *			'name':'xapp',
 *			'api':['ticket','index',{sn:'{{0.sn}}'}],
 *			'data': {
 *				sn:'{{0.sn}} {{1.sn}}',
 *				status:'DONE'
 *			}
 *		}).run().then(function(resp){
 *			console.log( 'Response', resp );
 *		})
 *		.catch(function(excp){
 *			console.log( 'Error', excp );
 *		})
 * 
 */
function que( option, name ) {

	var utils = new Utils( option );
	this.host = option['https'] || option['host'];
	this.prefix= option['table.prefix'] || '';
	this.api = 'https://' +  this.host + '/_a/baas/que';
	this.ss = new Session( option );
	this.ss.start();

	this._que = {};
	this.name = name || 'default';

	/**
	 * 选择/设定队列名称
	 * @param  string name 队列名称
	 * @return this
	 */
	this.select = function( name ) {
		this.name = name;
		return this;
	}

	/**
	 * 添加云端指令
	 * @param  string cmd 云端指令名称 (有效值: update/create/app )
	 * @param  object params 云端指令参数
	 * @return this
	 */
	this.push = function( cmd, params ) {
		var name = this.name;
		if ( typeof this._que[name] != 'object' ) this._que[name] = [] ;
		this._que[name].push({cmd:cmd, params:params});
		return this;
	}

	/**
	 * 运行队列
	 * @return 队列名称 & 每一项结果值
	 */
	this.run = function() {
		var that = this;
		return utils.request('POST', that.api + '/run', {_que:this._que, _prefix:this.prefix} );
	}

}

module.exports = que;