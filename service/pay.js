require('../lib/promise-7.0.4.min.js');
var Excp = require('excp.js');
var Session = require('session.js');
var Table = require('table.js');
var Utils = require('utils.js');

function Pay( option ) {

	option = option || {};

	var utils = new Utils( option );

	this.host = option['https'] || option['host'];
	this.prefix= option['table.prefix'] || '';
	this.api = 'https://' +  this.host + '/baas/pay';
	this.ss = new Session( option );
	this.ss.start();

	
	this.request = function() {
		return utils.request('POST', this.api + '/order');
	}


}

module.exports = Pay;