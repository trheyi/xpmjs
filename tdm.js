function tdm( opt ) {

	this.opt = opt || {};
	
	this.require = function ( service_name ) {
		var se = require( 'service'  +  '/' + service_name.toLowerCase() + '.js' );
		return new se( this.opt );
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

module.exports = new tdm()
