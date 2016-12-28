require('../lib/promise-7.0.4.min.js');
var Excp = require('excp.js');
var Session = require('session.js');
var Table = require('table.js');

function Wss( option ) {

	this.isOpen = false;
	this.events = {};
	this.host = option['wss'] || option['host'];
	this.ss = new Session( option );
	this.ss.start();

	this.prefix= option['table.prefix'] || '';
	this.table_name = option['ws.table'] || 'message';
	this.tab = new Table( option, this.table_name );



	/**
	 * 读取当前线上用户
	 * @return Promise
	 */
	this.liveUsers = function() {

	}





	this.bind = function( command, cb ) {
		
		var that = this;

		if ( command == 'close' ) {
			wx.onSocketClose(function(res){
			  that.isOpen = false;
			  cb(res);
			  return;
			});
		}


		this.events[command] = cb;
		return this;
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
				url: 'wss://' +  that.host + channel + '?_sid=' + that.ss.id() + '&_prefix=' + that.prefix + '&_table=' + that.table_name,
			});

			wx.onSocketOpen(function(res) {
				that.isOpen = true;
		  		resolve(res);
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
