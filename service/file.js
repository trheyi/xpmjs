var Excp = require('excp.js');
var Session = require('session.js');
var Table = require('table.js');

function File( option ) {

	option = option || {};

	this.host = option['https'] || option['host'];
	this.prefix= option['table.prefix'] || '';
	this.api = 'https://' +  this.host + '/_a/baas/file';
	this.ss = new Session( option );
	this.ss.start();
	this.que = [];
	
	this.save = function( f ) {
	}

	this.info = function( f ) {
	}

	this.list = function() {
	}

	this.open = function( f ){
	}

	this.rm = function( f ) {
	}

	this.up = function( f, name ) {
	}

	this.down = function( url ) {
	}

}

module.exports = File;