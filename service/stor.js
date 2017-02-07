if ( typeof Promise == 'undefined' ) { var _P = require('../lib/promise.min.js').Promise; } else { var _P = Promise; }
var Excp = require('excp.js');

function Stor( option ) {

	this.option = option || {};

	/**
	 * 保存数据，存在则覆盖
	 * @param string key 键
	 * @param mix value 值
	 * @param Promise
	 */
	this.set = function( key, value ) {

		var that = this;
		return new _P(function (resolve, reject) {
			
			if ( typeof key == 'undefined' ) {
				reject( new Excp('请输入关键词',500, {key:key, value:value}) );
			}

			wx.setStorage({
				key: key,
				data: value,
				success: function(res) {
				    resolve( value );
				},
				fail: function( err ) {
					reject( new Excp('请求 wx.setStorage 接口',500, {key:key, value:value, err:err}) );
				}
			});
		})
	}

	/**
	 * 读取数据
	 * @param  string key 键
	 * @return Promise
	 */
	this.get = function( key ) {

		var that = this;
		return new _P(function (resolve, reject) {
			
			if ( typeof key == 'undefined' ) {
				reject( new Excp('请输入关键词',500, {key:key}) );
			}

			wx.getStorage({
				key: key,
				success: function(res) {
				    resolve( res['data'] );
				},
				fail: function( err ) {
					reject( new Excp('请求 get.setStorage 接口',500, {key:key,  err:err}) );
				}
			});
		})
	}

	/**
	 * 读取同步接口
	 * @param  string key 键
	 * @return 成功返回 value 失败返回 Excp Object
	 */
	this.getSync = function( key ) {
		try {
			return wx.getStorageSync(key);

		}catch( e ) {
			return new Excp('请求 get.getStorage 接口',500, {key:key,  err:e}) 
		}
	}


	/**
	 * 保存同步接口
	 * @param string key 键
	 * @param mix value 值
	 * @return 成功返回 true 失败返回 Excp Object
	 */
	this.setSync = function( key, value) {
		try {
			wx.setStorageSync(key,value);
			return true;
		}catch( e ) {
			return new Excp('请求 get.setStorageSync 接口',500, {key:key,  err:e}) 
		}
	}


	/**
	 * 设定一张 Map 指定字段数值
	 * @param string name  Map名称
	 * @param string key   字段名称
	 * @param mix value  数值
	 * @param Promise
	 */
	this.setMap = function( name, key, value ) {

		var that = this;
		return new _P(function (resolve, reject) {

			that.get( name )
			.then( function(data) {
				data[key] = value;
				return that.set(name, data);
			})
			.catch( function(err ) {
				reject( err );
			})
		});

	}

	/**
	 * 设定一张 Map 指定字段数值 同步接口
	 * @param string name  Map名称
	 * @param string key   字段名称
	 * @param mix value  数值
	 * @return 成功返回 true 失败返回 Excp Object
	 */
	this.setMapSync = function( name, key, value ) {
		try {
			var data = wx.getStorageSync( name ) || {};
			data[key] = value;
			wx.setStorageSync(name,data);
			return true;
		}catch( e ) {
			return new Excp('请求 get.setStorageSync 接口',500, { name:name, key:key, value:value, err:e}) 
		}
	}

	/**
	 * 读取一张 Map 指定字段数值
	 * @param string name  Map名称
	 * @param string key   字段名称
	 * @param Promise
	 */
	this.getMap = function( name, key ) {
		var that = this;
		return new _P(function (resolve, reject) {
			that.get( name )
			.then( function(data) {
				data[key] = value;
				resolve( data[key] );
			})
			.catch( function(err ) {
				reject( err );
			})
		});
	}

	/**
	 * 读取一张 Map 指定字段数值 同步接口
	 * @param string name  Map名称
	 * @param string key   字段名称
	 * @return 成功返回 value 失败返回 Excp Object
	 */
	this.getMapSync = function( name,  key ) {
		try {
			var data = wx.getStorageSync( name );
			return data[key];

		}catch( e ) {
			return new Excp('请求 get.getStorageSync 接口',500, { name:name, key:key, err:e}) 
		}
	}

	/**
	 * 删除
	 * @param  string key 键
	 * @return 成功返回 true 失败返回 Excp Object
	 */
	this.rmSync = function( key ) {
		try {
			wx.removeStorageSync(key);
			return true;
		} catch (e) {
			return new Excp('请求 get.removeStorageSync 接口',500, {  key:key, err:e}) 
		}
	}


	/**
	 * 清空所有
	 * @return 成功返回 true 失败返回 Excp Object
	 */
	this.clearSync = function() {

		try {
			wx.clearStorageSync();
			return true;
		} catch (e) {
			return new Excp('请求 get.removeStorageSync 接口',500, {  key:key, err:e}) 
		}
		
	}

}


module.exports = Stor;
