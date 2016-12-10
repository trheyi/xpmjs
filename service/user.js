var Promise = require('../lib/bluebird.min.js');
var Excp = require('excp.js');

function login( name, mobile ) {

	return new Promise(function (resolve, reject) {
		wx.request({
			url:'http://www.baidu.com',
			success: function (res){ resolve( res); },
			fail: function (err) { 
				reject( new Excp(err.errMsg) );
			}
		});
	});

}




module.exports = {
  login: login
}
