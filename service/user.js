if ( typeof Promise == 'undefined' ) { var _P = require('../lib/promise.min.js').Promise; } else { var _P = Promise; }
var Excp = require('excp.js');
var Session = require('session.js');
var Table = require('table.js');
var Stor = require('stor.js');

function User( option )  {

	option = option || {};
	

    this.ss = new Session( option );
    this.stor = new Stor( option );

	this.host = option['https'] || option['host'];
	
	this.api = 'https://' +  this.host + '/_a/baas/user';

	// 1.5.1 + 废弃
	this.prefix= option['table.prefix'] || '';
	// 1.5.1 + 废弃
	this.table_name = option['user.table'] || 'user';
	// 1.5.1 + 废弃
	this.tab = new Table( option, this.table_name );
	// 1.5.1 + 废弃
	this.cid =  option.app || '';


	// 1.5.1 新增: 用户数据处理云端应用
	this.handler = option['user'] || '';
	this.appid = option['appid']; // 小程序ID，可不填写
	this.secret = option['secret']; // 云端鉴权 secret 格式为 appid|secret


	// 用户退出
	this.logout = function() {
		
		var that = this;
		return new _P(function (resolve, reject) {

			var reqData = {
				_sid:that.ss.id(), 
				_cid:that.cid,
				_table:that.table_name,
				_prefix:that.prefix,
				_secret:that.secret,  // 后端校验 Secret
				_appid:that.appid    // 小程序的 APPID
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

	// 清空缓存
	this.refresh = function(){
		this.ss.set('_login_user', null);
		this.ss.set('_login_id', null);
		return this;
	}

	// 更新 Session
	this.set = function( key, val ) {
		var userinfo = this.ss.get('_login_user') || {};
			userinfo['_user'] = userinfo['_user'] || {};
			
		userinfo[key] = val;
		userinfo['_user'][key] = val;
		this.ss.set('_login_user', userinfo);
	}

	// 用户登录
	this.login = function( detail ) {

		detail = detail || {};
		var rawData = detail.rawData || null;
		var signature = detail.signature || null;
		var that = this;

		return new _P(function (resolve, reject) {

			wx.login({
				success: function( loginResp ) {
					
					var userinfo = {};
					if ( that.ss.isVerified() && rawData == null ) {
						userinfo = that.ss.get('_login_user') ||  {};  	// 向前兼容
						userinfo['_id'] = that.ss.get('_login_id') ||  null;
						userinfo['_user']= that.ss.get('_login_user') ||  null; 
						if ( userinfo['_id']  != null || userinfo['_user'] !=null ) {
							resolve( userinfo );
							return;
						}
					}

					var reqData = {
						_sid:that.ss.id(), 
						_handler:that.handler, // 用户处理程序 (转交给云端应用处理)
						_secret:that.secret,  // 后端校验 Secret
						_appid:that.appid,    // 小程序的 APPID
						_cid:that.cid,  // 1.5.1 + 废弃
						_table:that.table_name,  // 1.5.1 + 废弃
						_prefix:that.prefix, // 1.5.1 + 废弃
						code: loginResp.code,
						rawData:rawData,
						signature:signature
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
                            if ( res['data']['_client_token'] ) {
                                that.stor.setSync('_client_token', res['data']['_client_token']);
                            }

							userinfo['_id'] = res['data']['_id'];
							if (typeof res['data']['_user'] != 'undefined' ) {
								that.ss.set('_login_user', res['data']['_user']);
								userinfo = res['data']['_user']; // 向前兼容
								userinfo['_user'] = res['data']['_user'];
							}

                            userinfo['__wxres'] = loginResp;
							resolve(userinfo); // DEBUG
						},

						fail: function (res) { 
							reject(new Excp('用户登录失败',500, {
								'res':res,
							}));
						}
					});

      			},
      			fail: function( res ) {
      				reject(new Excp('用户登录失败',500, {
						'res':res,
					}));
      			}
			});
		});
	}

	// 废弃
	this.get = function() {
		return new _P(function (resolve, reject) {
			reject({code:500, message:"此接口已废弃"});

			// wx.getSetting({
			// 	success: function(res) {
			// 		if (!res.authSetting['scope.userInfo']) {
			// 			wx.authorize({
			// 				scope:'scope.userInfo',
			// 				success: function(){
			// 					resolve({userInfo:{}});
			// 					// wx.getUserInfo({
			// 					// 	success: function( res ){
			// 					// 		resolve( res );
			// 					// 	},
			// 					// 	fail:function( res) {
			// 					// 		reject({code:402, message:"读取用户信息失败"});
			// 					// 	}
			// 					// });
			// 				},
			// 				fail: function(){
			// 					reject({code:402, message:"授权失败"});
			// 				}
			// 			});
			// 		}else {
			// 			resolve({userInfo:{}});
			// 			// wx.getUserInfo({
			// 			// 	success: function( res ){
			// 			// 		resolve( res );
			// 			// 	},
			// 			// 	fail:function( res) {
			// 			// 		reject({code:402, message:"读取用户信息失败"});
			// 			// 	}
			// 			// });
			// 		}
			// 	},
			// 	fail: function(res){
			// 		reject({code:500, message:"读取配置信息失败"});
			// 	}
			// });
		});
	}
}




module.exports = User;