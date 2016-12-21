require('../lib/promise-7.0.4.min.js');
var Excp = require('excp.js');

function Utils( option ) {

	this.guid = function(){
		
		function S4() {
    		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  		}
  		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}

	this.timediff = function( start, end, u ) {
		u = u || 'second'; // day hour  minute second
		var startDate = new Date( start );
		var endDate   = new Date( end );

		var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
		
		if ( u == 'second' ) {
			return seconds;
		} else if ( u == 'minute' ) {
			return seconds / 60
		} else if ( u == 'hour' ) {
			return seconds / 3600
		} else if ( u == 'day' ) {
			return seconds / 86400
		}
		
		return seconds;
	}
}

module.exports = Utils;