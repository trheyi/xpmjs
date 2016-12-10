var Promise = require('../lib/bluebird.min.js');
var Excp = require('excp.js');

function Wss( host ) {

	this.host = host || 'xxx';
	
	this.bind = function( command, cb ) {
		console.log( 'bind command:',  command, ' cb:', cb );
	}

	this.send = function ( command, params ) {
		console.log( 'send command: ', command, ' params:', params );
	}

}

module.exports = Wss;
