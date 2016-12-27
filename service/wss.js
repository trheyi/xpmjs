require('../lib/promise-7.0.4.min.js');
var Excp = require('excp.js');

function Wss( option ) {

	this.isOpen = false;
	this.events = {};

	this.host = option['wss'] || option['host'];
	this.bind = function( command, cb ) {

		this.events[command] = cb;
	}

	this.send = function ( command, params, to ) {

		
		var that = this;

		return new Promise(function (resolve, reject) {
			
			if (that.isOpen !== true ) {
				reject(new Excp('WebSocket未连接,请检查',500,
				{
					'command':command,
					'params': params
				}));
			}

			var to = to || null;

			wx.sendSocketMessage({
		      data:JSON.stringify({'c':command, 'b':params, 't':to }),
		      success: function( res ){
		      		resolve( res );
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

		console.log( 'send command: ', command, ' params:', params );
	}

	this.open = function( channel ) {
		
		var that = this;

		return new Promise(function (resolve, reject) {
			wx.connectSocket({
				header:{ 
				    'content-type': 'application/json'
				},
				url: 'wss://' +  that.host + channel
			});
			wx.onSocketOpen(function(res) {
				that.isOpen = true;
		  		resolve( res );
		  		return;
			});

			wx.onSocketError(function(res){
			  that.isOpen = false;
			  reject( new Excp(
			  	'WebSocket连接打开失败，请检查！', 500, 
			  	{
			  		'res':res,
			  		'channel':channel,
			  		'host':that.host
			  	}
			  ));

			  return;
			})

			wx.onSocketMessage(function( res ){

				if ( typeof res.data !== 'string' ) {
					return;
				}

				var resp = JSON.parse( res.data );
					resp['data'] = resp['data'] || {};

				var code = resp['code'];
				var req =  resp['data']['request'] || {};
				var resp = resp['data']['response'] || {};
				var cmd = req['c'] || null;
				

				if ( code !== 0  ) {
					if ( typeof that.events[cmd] == 'function' ) {
						that.events[cmd]( {'request':req, 'response':resp}, 'error');
					}
					return;
				}

				if ( typeof that.events[cmd] == 'function' ) {
					that.events[cmd]( {'request':req, 'response':resp}, 'success');
				}

			});

		});
	}

}

module.exports = Wss;
