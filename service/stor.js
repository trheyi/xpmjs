require('../lib/promise-7.0.4.min.js');
var Excp = require('excp.js');

function Stor( option ) {

	this.option = option || {};

	this.set = function( key, value ) {

		var that = this;
		return new Promise(function (resolve, reject) {
			
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

	this.get = function( key ) {

		var that = this;
		return new Promise(function (resolve, reject) {
			
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

	this.getSync = function( key ) {
		try {
			return wx.getStorageSync(key);

		}catch( e ) {
			return new Excp('请求 get.getStorage 接口',500, {key:key,  err:e}) 
		}
	}

	this.setSync = function( key, value) {
		try {
			wx.setStorageSync(key,value);
			return true;
		}catch( e ) {
			return new Excp('请求 get.setStorageSync 接口',500, {key:key,  err:e}) 
		}
	}


	this.setMap = function( name, key, value ) {

		var that = this;
		return new Promise(function (resolve, reject) {

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

	this.getMap = function( name, key ) {
		var that = this;
		return new Promise(function (resolve, reject) {
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
	 * @param  {[type]} key [description]
	 * @return {[type]}     [description]
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
	 * 清空
	 * @return {[type]} [description]
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
