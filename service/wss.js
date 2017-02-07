if ( typeof Promise == 'undefined' ) { var _P = require('../lib/promise.min.js').Promise; } else { var _P = Promise; }

var Excp = require('excp.js');
var Session = require('session.js');
var Table = require('table.js');

function Wss( option ) {

	this.isOpen = false;
	this.events = {};
	this.conn_events  = {};
	this.host = option['wss'] || option['host'];
	this.ss = new Session( option );
	this.ss.start();
	this.cid =  option.app || '';

	this.prefix= option['table.prefix'] || '';
	this.table_name = option['ws.table'] || 'message';
	this.user_table = option['user.table'] || 'user';
	this.tab = new Table( option, this.table_name );



	/**
	 * 读取当前线上用户
	 * @return Promise
	 */
	this.liveUsers = function() {

		var that = this;
		return new _P(function (resolve, reject) {

			var eventBack = null;
			if ( typeof that.events['getConnections'] == 'function' ) {
				eventBack = that.events['getConnections'];
			}

			that.events['getConnections'] = function( res, status ) {


				if ( eventBack != null ) {
					that.events['getConnections'] = eventBack;
				}

				if ( status == 'success' ) {
					resolve( res.response );
					return;
				} else {
					var error = res.error  || '读取当前线上用户失败';
					reject(new Excp( error ,500, {
						'status': status,
						'res':res
					}));
				}
			}
			that.send('getConnections').catch( function( e ) {reject(e)} );
		});
	}







	/**
	 * 查询用户是否在线 （ xpm-server 1.0rc4 以上 ）
	 * @param  string uid 用户ID
	 * @return Promise 在线 true 不在线 false
	 */
	this.isOnline = function( uid ) {

		var that = this;
		return new _P(function (resolve, reject) {

			var eventBack = null;
			if ( typeof that.events['ping'] == 'function' ) {
				eventBack = that.events['ping'];
			}

			that.events['ping'] = function( res, status ) {

				if ( eventBack != null ) {
					that.events['ping'] = eventBack;
				}
				if ( status == 'success' ) {

					if (  res.response.resp == 'pong' ) {
						resolve(true);
						return;
					}

					resolve(false);
					return;
				} else {
					var error = res.error  || '读取用户在线信息失败';
					reject(new Excp( error ,500, {
						'status': status,
						'res':res
					}));
				}
			}
			that.send('ping','user online', uid).catch( function( e ) {reject(e)} );
		});

	}


	/**
	 * 接收 WebSocket Sever 事件
	 * @param  string  evnet  事件名称，有效值 ( open/close/message/error )
	 * @param  function callback( res ) 回调函数
	 * @return  this
	 */
	this.bind = function ( evnet, callback ) { 
		this.conn_events[evnet] = callback;
		return this;
	}


	/**
	 * 接收指令并响应
	 * @param  string  command  指令名称
	 * @param  function callback( res, status ) 指定响应函数 
	 *         callback 参数表: 
	 *         		object res.request  请求参数 {"c": "command","b": {"info": "你好!"},"t": 2 }
	 *         		object res.response 请求用户 
	 *         			登录用户: {"_id": 2,  "nickName": "柳敏", "gender": 0, "avatarUrl": "..","language": "zh_CN","id": "e8e989e04627b7b5d73f019456f65d7d"} 
	 *         			未登录用户: {"id": "e8e989e04627b7b5d73f019456f65d7d"}
	 *         			
	 *         		string res.error 错误描述 
	 *         		string status 返回状态 succes/error
	 * @return this
	 */
	this.listen = function ( command, callback ) {
		this.events[command] = callback;
		return this;
	}


	/**
	 * 发送指令
	 * @param  string command 指令名称
	 * @param  object params  请求参数
	 * @param  string/int receiver 接受者 ( 连接 id 或者用户 id )
	 * @return Promise
	 */
	this.send = function ( command, params, receiver ) {

		var that = this;

		return new _P(function (resolve, reject) {
			
			if (that.isOpen !== true ) {
				reject(new Excp('WebSocket未连接', 401, {
					'command':command,
					'params': params,
					'receiver': receiver
				}));
			}

			receiver = receiver || null;
			wx.sendSocketMessage({
		      data:JSON.stringify({'c':command, 'b':params, 't':receiver }),
		      success: function( res ){
		      	resolve( true );
		      },
		      fail: function( res ){
		      	reject(new Excp('消息发送失败',500,
				{
					'command':command,
					'params': params,
					'res':res
				}));
		      }
		    });
		});

	}


	/**
	 * 打开 Websocket 信道
	 * @param  string channel 信道地址
	 * @param  boolen ignore  true: 如果信道已连接反返回正确信息，默认为 true
	 * @return Promise
	 */
	this.open = function( channel, ignore ) {
		
		var that = this;
			if ( typeof ignore == 'undefined') ignore = true;

		return new _P(function (resolve, reject) {
			
			if ( ignore && that.isOpen) {
				resolve(true);
				return 
			}

			// wx.connectSocket BUG Android success （函数返回值不正确 ）
			wx.connectSocket({
				url: 'wss://' +  that.host + channel + '?_sid=' + that.ss.id() + '&_prefix=' + that.prefix + '&_table=' + that.table_name  + '&_user=' + that.user_table+ '&_cid=' + that.cid,
				success:function( res, status ){},
				fail: function( res ){
					// console.log( 'wx.connectSocket fail', res);
					reject( new Excp(
					  	'WebSocket Error', 500, {
					  		'res':res,
					  		'isOpen': that.isOpen,
					  		'channel':channel,
					  		'host':that.host
					  	}
					));
					return;
				}
			});

			wx.onSocketOpen(function(res) {

				that.isOpen = true;
				if ( typeof that.conn_events['open'] == 'function' ) {
		  			try { 
		  				that.conn_events['open']( res );
		  			} catch(e){}
		  	  	}

		  	  	resolve( res );

		  		return;
			});


			// BUG Android 接收不到错误通知
			wx.onSocketError(function(res){
			  // that.isOpen = false;

			  if ( typeof that.conn_events['error'] == 'function' ) {
		  			try { 
		  				that.conn_events['error']( res );
		  			} catch(e){}
		  	  }

		  	  reject( new Excp(
			   	'WebSocket Error', 500, {
			   		'res':res,
			   		'isOpen': that.isOpen,
			   		'channel':channel,
			   		'host':that.host
			   	}
			  ));

			  return;
			});


			wx.onSocketClose(function(res) {
				that.isOpen = false;
		  		if ( typeof that.conn_events['close'] == 'function' ) {
		  			try { 
		  				that.conn_events['close']( res );
		  			} catch(e){}
		  		}

			});

			wx.onSocketMessage(function( res ){

				if ( typeof that.conn_events['message'] == 'function' ) {
		  			try { 
		  				that.conn_events['message']( res );
		  			} catch(e){}
		  	  	}

				if ( typeof res.data !== 'string' ) {
					return;
				}

				var resp = JSON.parse( res.data );
					resp['data'] = resp['data'] || {};

				var code = resp['code'];
				var req =  resp['data']['request'] || {};
				var res = resp['data']['response'] || {};
				var error = resp['data']['error'] || null;
				var cmd =  req['c'] || null;


				if ( code !== 0  ) {
					if ( typeof that.events[cmd] == 'function' ) {


						that.events[cmd]( {'request':req, 'response':res,'error':error}, 'error');
					}
					return;
				}

				if ( typeof that.events[cmd] == 'function' ) {
					that.events[cmd]( {'request':req, 'response':res}, 'success');
				}

			});

		});
	}
	

	/**
	 * 关闭 Websocket 信道
	 * @return null
	 */
	this.close = function() {
		wx.closeSocket();
	}

	/**
	 * 设定/查询信道鉴权 ( 需要管理员权限 )
	 * @return Promise
	 */
	this._acl = function() {
	}

}

module.exports = Wss;
