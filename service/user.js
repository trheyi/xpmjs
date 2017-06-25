if ( typeof Promise == 'undefined' ) { var _P = require('../lib/promise.min.js').Promise; } else { var _P = Promise; }
var Excp = require('excp.js');
var Session = require('session.js');
var Table = require('table.js');

function User( option )  {

	option = option || {};
	

	this.ss = new Session( option );
	this.host = option['https'] || option['host'];
	this.prefix= option['table.prefix'] || '';
	this.table_name = option['user.table'] || 'user';
	this.api = 'https://' +  this.host + '/_a/baas/user';
	this.tab = new Table( option, this.table_name );
	this.cid =  option.app || '';


	// 用户退出
	this.logout = function() {
		
		var that = this;
		return new _P(function (resolve, reject) {

			var reqData = {
				_sid:that.ss.id(), 
				_cid:that.cid,
				_table:that.table_name,
				_prefix:that.prefix,
			};

			wx.request({
				url: that.api + '/logout',
				data: reqData, // 使用 Code 换取 Session ID 
				header: {'content-type': 'application/json'},
				method: 'POST',
				success: function (res){

					if ( res.statusCode != 200 ) {
						reject(new Excp('用户退出失败 API错误',500, {
							'res':res,
						}));
						return;
					}

					if ( typeof res['data'] != 'object') {
						reject(new Excp('用户退出失败 API错误',500, {
							'res':res,
						}));
						return;
					}

					if ( res['data']['code'] != 0) {
						reject(new Excp('用户退出失败, Session 校验失败',500, {
							'res':res,
						}));
						return;
					}
					that.ss.destory(); // 清空会话数据
					resolve( res['data'] );
				},

				fail: function (res) { 

					reject(new Excp('用户退出失败',500, {
						'res':res,
					}));
				}
			});


		});

	}


	// 用户登录
	this.login = function() {
		
		var that = this;
		return new _P(function (resolve, reject) {

			wx.login({
				success: function( coderes ) {

					that.get() 

					.catch(function(e){
						reject(e);
					})

					.then( function( res ) {

						var userinfo = res.userInfo;

						if ( that.ss.isVerified() ) {
							userinfo['_id'] = that.ss.get('_login_id') ||  null;
							if ( userinfo['_id']  != null ) {
								resolve( userinfo );
								return;
							}
						}

						var reqData = {
							_sid:that.ss.id(), 
							_cid:that.cid,
							_table:that.table_name,
							_prefix:that.prefix,
							code: coderes.code,
							rawData:res.rawData,
							signature:res.signature
						};

						wx.request({
							url: that.api + '/login',
							data: reqData, // 使用 Code 换取 Session ID 
							header: {'content-type': 'application/json'},
							method: 'POST',
							success: function (res){

								if ( res.statusCode != 200 ) {
									reject(new Excp('用户登录失败 API错误',500, {
										'res':res,
									}));
									return;
								}

								if ( typeof res['data'] != 'object') {
									reject(new Excp('用户登录失败 API错误',500, {
										'res':res,
									}));
									return;
								}

								if ( res['data']['result'] !== true) {
									reject(new Excp('用户登录失败, Session 校验失败',500, {
										'res':res,
									}));
									return;
								}

								that.ss.id( res['data']['id'] ); // 设定服务端分配的ID 
								that.ss.set('_login_id', res['data']['_id']);
								userinfo['_id'] = res['data']['_id'];
								resolve( userinfo );

							},

							fail: function (res) { 

								reject(new Excp('用户登录失败',500, {
									'res':res,
								}));
							}
						});

					})

      			},

      			fail: function( res ) {
      				reject(new Excp('用户登录失败',500, {
						'res':res,
					}));
      			}
			});


			
		});
	}


	this.get = function() {
		
		return new _P(function (resolve, reject) {
			
			wx.getUserInfo({
      			success: function(res) {
      				resolve( res );
      			},

      			fail: function( res ) {
      				reject(new Excp('读取用户信息错误',500, {
						'res':res,
					}));
      			}
      		});

		});
	}
}




module.exports = User;