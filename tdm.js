var Excp = require('service/excp.js');
var User = require('service/user.js');
var Wss = require('service/wss.js');

function tdm( opt ) {

	this.opt = opt || {};
	
	this.require = function ( service_name ) {
		var se = require( 'service'  +  '/' + service_name.toLowerCase() + '.js' );
		return new se( this.opt );
	}

	this.option = function ( option ) {
		if ( typeof option != 'undefined' ) {
			this.opt = option;
			return this;
		} else {
			return this.opt;
		}
	}

}

module.exports = new tdm()
