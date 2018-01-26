/**
 * XpmJS RN 版本 
 * *******************************************************
 * * 当前 Secret 明文写入js中存在被盗风险                    *
 * * 下一版计划用原生模块的方式实现，将 secret 编译到应用       *
 * *******************************************************
 */
import App from './service.rn/app';

function xpm( opt ) {


	this.opt = opt || {};

	/**
	 * 载入应用文件
	 * @param  {[type]} params [description]
	 * @return {[type]}        [description]
	 */
	this.api = function ( params ) {

		return ( query ) => {
			let inst = new App( this.opt, params );
			return inst._(query);
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


