require('../lib/promise-7.0.4.min.js');
var Excp = require('excp.js');
var Session = require('session.js');
var Table = require('table.js');
var Utils = require('utils.js');

function Pay( option ) {

	option = option || {};

	var utils = new Utils( option );

	this.host = option['https'] || option['host'];
	this.prefix= option['table.prefix'] || '';
	this.api = 'https://' +  this.host + '/baas/pay';
	this.ss = new Session( option );
	this.ss.start();
	this.cloudEvents = {'before':[], 'success':[], 'complete':[], 'fail':[] };


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
		
		var that = this;

		return new Promise(function (resolve, reject) {

			params['_events'] = that.cloudEvents;
			params['_prefix'] = that.prefix;

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
					   			

					   			utils.request('POST', that.api + '/return', {	
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