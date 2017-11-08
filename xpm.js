function xpm( opt ) {

	this.opt = opt || {};

	this.getPromise = function(){
		if ( typeof Promise == 'undefined' ) { var _Promise = require('lib/promise.min.js').Promise; } else { var _Promise = Promise } 
		return _Promise;
	}


	/**
	 * 载入服务文件
	 * @param  {[type]} service_name [description]
	 * @param  {[type]} params       [description]
	 * @return {[type]}              [description]
	 */
	this.require = function ( service_name, params  ) {
		var se = require( 'service'  +  '/' + service_name.toLowerCase() + '.js' );
		params = params || {};
		if ( arguments.length > 2 ) {
			var more = arguments[2];
			return new se( this.opt , params, more );
		}
		
		return new se( this.opt , params );
	}


	/**
	 * 载入应用文件
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	this.api = function ( params ) {
		var that = this;
		return function( query ){
			return that.require('app', params)._(query);
		}
	}



	/**
	 * 设定配置信息
	 * @param  array option 设置或读取配置信息
	 * @return this / option = null return option 
	 */
	this.option = function ( option ) {
		if ( typeof option != 'undefined' ) {
			this.opt = option;
			return this;
		} else {
			return this.opt;
		}
	}

}

module.exports = new xpm()


