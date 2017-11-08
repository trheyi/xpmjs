if ( typeof Promise == 'undefined' ) { var _P = require('../lib/promise.min.js').Promise; } else { var _P = Promise; }
var Excp = require('excp.js');
var Session = require('session.js');
var Table = require('table.js');
var Utils = require('utils.js');


/**
 * 发起支付请求
 * @param  object option 
 * @return 
 *
 * var pay = app.xpm.require('Pay');
 *
 * // 快速
 * pay.request({
 *     total_fee:500,  // 单位分
 *     body:'算命、服务器开光',
 *     attach:'HELLO XpmJS.com', 
 *     detail:'{id:888,desp:"算命,抽SSR,赠送服务器开光"}'
 * }).then(function( data ){
 *     console.log('Request Pay Success', data );
 * }).catch( function( excp){
 *     console.log('Request Pay Failure', excp );
 * });
 *
 *
 * // 高级用法 ( require xpmjs-server 1.0rc4 )
 *
 * pay.before('create', {  // 创建充值记录 (统一下单成功后, 发起支付前, 在云端运行 )
 * 	'table':'income',
 * 	'data': {
 * 		sn:'{{sn}}',
 * 		order_sn: data.order.sn,
 * 		uid:data.order.uid,
 * 		amount:data.order.sale_price,
 * 		amount_free:0,
 * 		status:'PENDING',
 * 		status_tips:"F请求付款"
 * 	}
 * })
 * 
 * .order({   // 生成订单  ( 统一下单接口, 仅设定并不发送请求 )
 *     total_fee:data.order.sale_price,  // 单位分
 *     body:data.order.show_name,
 *     attach:'attach user is ' + mid,  // 应该是当前登录用户的 ID 
 *     detail:data
 * })
 * 
 * .success('update', { // 更新充值记录 （ 支付成功后回调，在云端运行 ）
 * 	'table':'income',
 * 	'data': {
 * 		sn:'{{sn}}',
 * 		status:'DONE',
 * 		status_tips:"income status_tips field"
 * 	},
 * 	'unique':'sn'
 * })
 
 * .success('app', {   // 调用APP 示例 （ 支付成功后回调，在云端运行 ）
 * 	'name':'xapp',
 * 	'api':['ticket','index',{sn:'{{sn}}','status_tips':"{{0.status_tips}}"}],
 * 	'data': {
 * 		sn:'{{sn}}',
 * 		status:'DONE'
 * 	}
 * })
 * 
 * .success('update', {  // 更新订单状态 （ 支付成功后回调，在云端运行 ）
 * 	'table':'order',
 * 	'data': {
 * 		_id:oid,
 * 		status:'PENDING'
 * 	}
 * })
 * 
 * .success('create', {   // 创建消费记录 （ 支付成功后回调，在云端运行 ）
 * 	'table':'payout',
 * 	'data': {
 * 		sn:'{{sn}}',
 * 		order_sn: data.order.sn,
 * 		uid:data.order.uid,
 * 		amount:data.order.sale_price,
 * 		amount_free:0,
 * 		status:'DONE',
 * 		status_tips:"F请求付款"
 * 	}
 * })
 * 
 * .request().then(function( payResp  ) {  // 发起请求
 * 	
 * 	app.wss.send('payment.answer', {code:0, payment:payResp, id:oid}, mid );
 * 
 * }).catch(function( excp) {
 * 	app.wss.send('payment.answer', {code:500,excp:excp}, mid );
 * });		
 *
 * 
 */
function Pay( option ) {

	option = option || {};


	var utils = new Utils( option );

	this.host = option['https'] || option['host'];
	this.prefix= option['table.prefix'] || '';
	this.api = 'https://' +  this.host + '/_a/baas/pay';
	this.ss = new Session( option );
	this.ss.start();
	this.cloudEvents = {'before':[], 'success':[], 'complete':[], 'fail':[] };
	this.params =  {};



	/**
	 * 发起微信支付请求
	 *
	 * @see https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1
	 * @param  array params 支付请求参数 
	 *         params['total_fee'] & params['body'] 必须填写
	 *         
	 * @return Promise
	 */
	this.request = function( params ) {
		
		params = params || this.params;

		var that = this;

		return new _P(function (resolve, reject) {

			params['_events'] = that.cloudEvents;
			params['_prefix'] = that.prefix;
			that.cloudEvents = {'before':[], 'success':[], 'complete':[], 'fail':[] };

			utils.request('POST', that.api + '/unifiedorder', params )

			.then(function( data ) {

				if ( data['return_code'] == 'SUCCESS' ) {

					wx.requestPayment({
					   'timeStamp': data['timeStamp'].toString(),
					   'nonceStr': data['nonceStr'],
					   'package':data['package'],
					   'signType': 'MD5',
					   'paySign': data['paySign'],
					   'success':function(res) {	

					   		 // Request Pay Success
					   		if ( typeof params['_events']['success'] == 'object'  || 
					   			 typeof params['_events']['complete'] == 'object'   ) {
					   			

					   			utils.request('POST', that.api + '/payreturn', {	
					   			   '_prefix':that.prefix,
					   			   'sn':data['sn'],
								   'timeStamp': data['timeStamp'].toString(),
								   'nonceStr': data['nonceStr'],
								   'package':data['package'],
								   'signType': 'MD5',
								   'paySign': data['paySign']
					   			}).then(function( resp ) {
					   				
					   				resolve({
							   			return_code:'SUCCESS',
							   			attach:params['attach'],
							   			out_trade_no:data['out_trade_no'],
							   			prepay_id:data['prepay_id'],
							   			sn:resp['sn'],
							   			status:resp['events']
							   		});

					   			}).catch( function( excp ) {
									
									reject(excp);
								});

					   		} else {
						   		resolve({
						   			return_code:'SUCCESS',
						   			attach:params['attach'],
						   			out_trade_no:data['out_trade_no'],
						   			prepay_id:data['prepay_id'],
						   			sn:data['sn'],
						   			status:data['events']
						   		});

					   		}
					   },
					   
					   'fail':function(res) {
					   		reject(new Excp('微信支付接口错误',500, {'res':res}));
					   }

					});

				} else {
					reject(new Excp('统一下单接口错误',500, {'data':data}));
				}
			})

			.catch( function( excp ) {
				reject(excp);
			})
		});

	}


	/**
	 * 统一下单成功后, 发起支付前, 在云端运行 ( require xpm-server 1.0rc4+ )
	 * @param  {[type]} cmd    [description]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	this.before = function( cmd, params ) {
		return this.runAtCloud( 'before', cmd, params);
	}


	/**
	 * 统一下单接口
	 * 
	 * @see https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1
	 * @param  array params 支付请求参数 
	 *         params['total_fee'] & params['body'] 必须填写
	 *         
	 * @return Promise
	 */
	this.order = function( params ) {

		this.params = params;
		return this;
	}



	/**
	 * 支付成功后回调，在云端运行 ( require xpm-server 1.0rc4+ )
	 * @param  {[type]} cmd    [description]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	this.success = function( cmd, params ) {
		return this.runAtCloud( 'success', cmd, params);
	}


	/**
	 * 支付失败后回调, 在云端运行 ( require xpm-server 1.0rc4+ )
	 * @param  {[type]} cmd    [description]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	this.fail = function( cmd, params ) {
		return this.runAtCloud( 'fail', cmd, params);
	}


	/**
	 * 支付完成回调, 在云端运行 ( require xpm-server 1.0rc4+ )
	 * @param  {[type]} cmd    [description]
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	this.complete = function( cmd, params ) {
		return this.runAtCloud( 'complete', cmd, params);
	}


	/**
	 * 添加云端运行指令 ( require xpm-server 1.0rc4+ )
	 * @param  string event  有效值 before/sucess/fail/complete
	 * @param  string cmd    云端指令, 有效值 update/create/app
	 * @param  mix params 	 云端指令参数
	 * @return this
	 */
	this.runAtCloud = function( event, cmd, params ) {
		if ( typeof this.cloudEvents[event] != 'object' ) return this;
		this.cloudEvents[event].push({cmd:cmd, params:params});
		return this;
	}

}

module.exports = Pay;