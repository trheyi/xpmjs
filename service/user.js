require('../lib/promise-7.0.4.min.js');
var Excp = require('excp.js');
var Session = require('session.js');

function User( option )  {

	
	option = option || {};

	this.host = option['https'] || option['host'];
	this.api = this.host + '/baas/user';
	this.ss = new Session( option );


	// 用户登录
	this.login = function() {
		
		var that = this;
		return new Promise(function (resolve, reject) {

			wx.login({
				success: function( coderes ) {

					that.getUserInfo() 

					.catch(function(e){
						reject(e);
					})

					.then( function( res ) {

						var userinfo = res.userInfo;

						if ( that.ss.isVerified() ) {
							resolve( userinfo );
							return;
						}

						wx.request({
							url: that.api + '/login',
							data: { code:coderes.code, _sid:that.ss.id(), rawData:res.rawData, signature:res.signature }, // 使用 Code 换取 Session ID 
							header: {'content-type': 'application/json'},
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


	this.getUserInfo = function() {
		
		return new Promise(function (resolve, reject) {
			
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