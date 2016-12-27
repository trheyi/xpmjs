require('../lib/promise-7.0.4.min.js');
var Excp = require('excp.js');

/**
 * 常用工具
 * @param {[type]} option [description]
 */

function Utils( option ) {

	/**
	 * 生成一个 Guid
	 * @return GUID
	 */
	this.guid = function(){
		
		function S4() {
    		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  		}
  		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}



	/**
	 * 计算时间差值
	 * @param  datetime start 开始时间
	 * @param  datetime end   结束时间
	 * @param  string unit 时间单位 （ 默认 second,  有效值  day hour  minute second ）
	 * @return 时间差值
	 */
	this.timediff = function( start, end, unit ) {
		var u = unit || 'second'; // day hour  minute second
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