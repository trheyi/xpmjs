require('../lib/promise-7.0.4.min.js');
var Excp = require('excp.js');

function User( option )  {

	
	option = option || {};

	this.host = option['https'] || option['host'];
	this.api = this.host + '/baas/user';


	// 用户登录
	this.login = function() {
		
		var that = this;
		return new Promise(function (resolve, reject) {
			
			wx.login({
				success: function(res) {

      				wx.request({
						url: that.api + '/login',
						data: { code:res.code }, // 使用 Code 换取 Session ID 
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
							}

							resolve( res['data'] ); 
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


	this.getUserInfo = function() {
		
		return new Promise(function (resolve, reject) {
			
			wx.getUserInfo({
      			success: function(res) {

      				var user = JSON.parse( res.rawData );
      					user['signature'] = res.signature;
      					user['iv'] = res.iv;
      					user['encryptedData'] = res.encryptedData;

      				resolve( user );
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