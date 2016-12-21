require('../lib/promise-7.0.4.min.js');
var Excp = require('excp.js');
var Stor = require('stor.js');
var Utils = require('utils.js');

function Session( option ) {

	this.option = option || {};
	this.stor = new Stor( option );
	this.utils = new Utils( option );

	/**
	 * 读取/设定客户端会话 ID 
	 * @param  {[type]} session_id [description]
	 * @return {[type]}            [description]
	 */
	this.id = function( session_id, get_object ) {

		var stor = this.stor;
		var utils = this.utils;
		var expires_in = this.option['session.expires_in'] || 7200;
		get_object = get_object || false;

		session_id = session_id || null;
		if ( session_id == null ) {

			var ss = stor.getSync('_SESSION_ID');
			if ( ss == "" || ss == null || ss == undefined) {
				return null;
			} else if ( utils.timediff( ss['at'], new Date()) >=  ss['expires_in'] ) {
				stor.setSync( '_SESSION_ID', null);
				return null;
			}
			
			if ( get_object === true ) {
				return ss;
			}

			return ss['id'];

		} else {
			return stor.setSync( '_SESSION_ID', {id:session_id, expires_in:expires_in,  at:new Date(), verified:false } )
		}
	}


	/**
	 * 开始客户端会话
	 * @return {[type]} [description]
	 */
	this.start = function() {

		var stor = this.stor;
		var utils = this.utils;
		var expires_in = this.option['session.expires_in'] || 7200;

		var sid = this.id();
		if ( sid == "" || sid == null || sid == undefined) {
			sid = utils.guid();
			var resp = this.stor.setSync( '_SESSION_ID', {id:utils.guid(), expires_in:expires_in, at:new Date(), verified:false } );
			if (resp !== true ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * 读取 Session 会话变量
	 * @param  {[type]} key [description]
	 * @return {[type]}     [description]
	 */
	this.get = function( key ) {
		var stor = this.stor;
		return stor.getMapSync('_SESSION.' + this.id() , key );
	}


	/**
	 * 写入 Session 会话变量
	 */
	this.set = function( key, value ) {
		var stor = this.stor;
		return stor.setMapSync('_SESSION.' + this.id(), key, value );
	}


	/**
	 * 清空 Session
	 * @param  {[type]} session_id [description]
	 * @return {[type]}            [description]
	 */
	this.destory = function( session_id ) {
		var stor = this.stor;
		session_id = session_id || this.id()
		stor.rmSync('_SESSION.' + this.id() );
		stor.rmSync('_SESSION_ID');
	}


	this.isVerified = function() {
		var ss = this.id( null, true );
		if ( ss['verified'] === true ) {
			return true;
		}

		return false;
	}


}

module.exports = Session;
