var Promise = require('../lib/bluebird.min.js');
var Excp = require('excp.js');

function Wss( host ) {

	this.host = host || 'xxx';
	
	this.bind = function( command, cb ) {

		wx.onSocketMessage(function( res ){
			cb( res );
		});

		console.log( 'bind command:',  command, ' cb:', cb );
	}

	this.send = function ( command, params ) {
		console.log( 'send command: ', command, ' params:', params );
	}

	this.open = function( api ) {
		
		var that = this;

		return new Promise(function (resolve, reject) {
			wx.connectSocket({
		  		url: 'wss://' +  that.host + api
			});

			wx.onSocketOpen(function(res) {
		  		resolve( res );
			});

			wx.onSocketError(function(res){
			  reject( new Excp(
			  	'WebSocket连接打开失败，请检查！', 500, 
			  	{
			  		'res':res,
			  		'api':api,
			  		'host':that.host
			  	}
			  ));
			})
		});
	}

}

module.exports = Wss;
