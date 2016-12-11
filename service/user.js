require('../lib/promise-7.0.4.min.js');
var Excp = require('excp.js');

function login( name, mobile ) {
	console.log( name, mobile, Promise );

	// return new Promise(function (resolve, reject) {
	// 	wx.request({
	// 		url:'https://wxcloud.tuanduimao.cn/baas/default/index',
			
	// 		success: function (res){ 
	// 			resolve( res['data'] ); 
	// 		},

	// 		fail: function (err) { 
	// 			reject( new Excp(err.errMsg) );
	// 		}
	// 	});
	// });

}



module.exports = {
  login: login
}
