let _P = Promise;
import Excp  from './excp';
import Utils  from './utils';

function App( option, app_name, query ) {

	this.option = option || {};
	this.app_name_o  = app_name = app_name || '';
	this.host = option['https'] || option['host'];
	this.apihost = 'https://' +  this.host + '/_a/baas/route/app';
	this.query = query || {};
	this.sync = false;

	this.utils = new Utils( this.option );
	var app_name_arr = app_name.split('/');
	if ( app_name_arr.length == 1 ) {
		this.org_name = 'xpmsns';
		this.app_name = app_name_arr[0];

	} else {
		this.org_name = app_name_arr[0];
		this.app_name = app_name_arr[1];
	}

	/**
	 * + method 方法
	 * @param  {[type]} method [description]
	 * @return {[type]}        [description]
	 */
	this.method = function(  query ) {
		query = query || {};
		this.query = this.utils.merge(this.query, query);
		this.apihost = 'https://' + this.host + '/_api/' +  this.app_name_o;
		return this;
	}

	/**
	 * 迅捷函数
	 * @param  {[type]} method [description]
	 * @return {[type]}        [description]
	 */
	this._ = this.method;

	this.$ = function(){
		return this.utils;
	}

	this.api = function( controller, action, query ) {
		query = query || {};
		this.query = this.utils.merge(this.query, query);
		this.query['_c'] = controller || 'defaults';
		this.query['_a'] = action || 'index';
		this.query['_app'] = this.app_name;
		this.query['_org'] = this.org_name;
		return this;
	}


	this.get = function ( param, json ) {

		param = param || {};

		var query = [], queryString ='',  api=this.apihost,  opt={};

		for( var field in param  ){
			query.push(field + '=' + param[field]);
		}

		for( var field in this.query ) {
			query.push(field + '=' + this.query[field]);
		}

		if ( typeof json == 'undefined' || json === true ) {
			opt['dataType'] = 'json';
		} else {
			opt['dataType'] = 'text';
		}

		queryString = query.join('&');
		if ( api.indexOf('?') === -1 ) {
			api = api + '?' + queryString;
		} else {
			api = api + '&' + queryString;
		}
		return this.utils.request('GET', api, {}, opt );
	}


	this.post = function ( data, opt ) {
		data = data || {};
		var query = [], queryString ='',  api=this.apihost,  opt={};
		for( var field in this.query ) {
			query.push(field + '=' + this.query[field]);
		}

		opt['header'] = opt['header'] || {};
		opt['dataType'] = opt['dataType'] || 'json';
		opt['header']['content-type'] = opt['content-type'] || 'application/x-www-form-urlencoded';

		queryString = query.join('&');
		if ( api.indexOf('?') === -1 ) {
			api = api + '?' + queryString;
		} else {
			api = api + '&' + queryString;
		}


		return this.utils.request('POST', api, data, opt );
	}


	this.upload = function( tmpFile, name, data, opt ) {

		name = name || 'wxfile';
		data = data || {};
		var query = [], queryString ='',  api=this.apihost,  opt= opt ||  {};
		for( var field in this.query ) {
			query.push(field + '=' + this.query[field]);
		}

		opt['header'] = opt['header'] || {};
		opt['dataType'] = opt['dataType'] || 'json';

		queryString = query.join('&');
		if ( api.indexOf('?') === -1 ) {
			api = api + '?' + queryString;
		} else {
			api = api + '&' + queryString;
		}

		return this.utils.upload(tmpFile, name, api, data, opt );
	}

}


module.exports = App;
