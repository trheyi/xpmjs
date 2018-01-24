if ( typeof Promise == 'undefined' ) { var _P = require('../lib/promise.min.js').Promise; } else { var _P = Promise; }
var Excp = require('excp.js');
var Stor = require('stor.js');

function Session( option ) {

	this.option = option || {};
	this.stor = new Stor( option );


	this.guid = function(){
		
		function S4() {
    		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  		}
  		return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
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



	/**
	 * 读取/设定客户端会话 ID 
	 * @param  {[type]} session_id [description]
	 * @return {[type]}            [description]
	 */
	this.id = function( session_id, get_object ) {

		var stor = this.stor;
		var expires_in = this.option['session.expires_in'] || 7200;
		get_object = get_object || false;

		session_id = session_id || null;
		if ( session_id == null ) {

			var ss = stor.getSync('_SESSION_ID');
			if ( ss == "" || ss == null || ss == undefined) {
				return null;
			} else if ( this.timediff( ss['at'], new Date()) >=  ss['expires_in'] ) {
				stor.setSync( '_SESSION_ID', null);
				return null;
			}
			
			if ( get_object === true ) {
				return ss;
			}

			return ss['id'];

		} else {
			return stor.setSync( '_SESSION_ID', {id:session_id, expires_in:expires_in,  at:new Date(), verified:true } )
		}
	}


	/**
	 * 开始客户端会话
	 * @return {[type]} [description]
	 */
	this.start = function() {

		var stor = this.stor;
		var expires_in = this.option['session.expires_in'] || 7200;

		var sid = this.id();
		if ( sid == "" || sid == null || sid == undefined) {
			sid = this.guid();
			var resp = this.stor.setSync( '_SESSION_ID', {id:sid, expires_in:expires_in, at:new Date(), verified:false } );
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


	/**
	 * Session 是否通过后端验证
	 * @return {Boolean} [description]
	 */
	this.isVerified = function() {
		var ss = this.id( null, true );
		
		if ( ss === null ) {
			return false;
		}

		if ( ss['verified'] === true ) {
			return true;
		}

		return false;
	}

}

module.exports = Session;
