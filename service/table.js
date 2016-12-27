require('../lib/promise-7.0.4.min.js');
var Excp = require('excp.js');
var Session = require('session.js');

function table( option, table_name ) {

	option = option || {};

	this.host = option['https'] || option['host'];
	this.prefix= option['table.prefix'] || '';
	this.api = 'https://' +  this.host + '/baas/table';
	this.table_name = table_name || null;
	this.sync = false;
	this.ss = new Session( option );
	this.ss.start();
	


	/**
	 * 这个方法暂未实现 ( 转成同步函数 )
	 * @return {[type]} [description]
	 */
	this.sync = function() { 
		this.sync = true;
		return this;
	}

	this.table = function() {
		return '_baas_' +  this.prefix + '_' +  this.table_name;
	}


	/**
	 * 创建一条记录
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	this.create = function( data ) {
		return this.__r('/create', {data:data} );
	}


	/**
	 * 根据数据表ID, 更新一条记录
	 * @param  {[type]} id   [description]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	this.update = function( id, data ) {
		return this.__r('/update', {_id:id, data:data} );
	}


	/**
	 * 使用数据表唯一主键，创建一条记录
	 * @param  {[type]} $uni_key [description]
	 * @param  {[type]} $data    [description]
	 * @return {[type]}          [description]
	 */
	this.updateBy = function( uni_key, data ) {
		return this.__r('/updateby', {uni_key:uni_key, data:data} );	
	}



	/**
	 * 根据数据表唯一主键数值，删除一条记录
	 * @param  {[type]} data_key [description]
	 * @param  {[type]} uni_key  [description]
	 * @return {[type]}          [description]
	 */
	this.remove = function( data_key, uni_key ){
		uni_key = uni_key || '_id';
		return this.__r('/remove', {data_key:data_key, uni_key:uni_key});
	}


	this.select = function( where, data, fields ) {
		fields = fields || [];
		data = data || [];
		where = where || "";
		return this.__r('/select', {query:where, data:data, fields:fields});
	}


	this.getData = function ( where, data, fields ) {

	}

	this.getLine = function ( where, data, fields ) {

		fields = fields || [];
		data = data || [];
		where = where || "";
		return this.__r('/getline', {query:where, data:data, fields:fields});

	}

	this.getVar = function( field,  where, data ) {

		field = field || '_id';
		data = data || [];
		where = where || "";
		return this.__r('/getvar', {query:where, data:data, field:field});
	}

	
	this.runSql = function ( sql, data, ret  ) {
		sql = sql || "";
		ret = ret || false;
		data = data || [];
		return this.__r('/runsql', {sql:sql, data:data, return:ret});
	}

	this.nextid = function() {
		return this.__r('/nextid', {});	
	}

	this.get = function( id ) {
		return this.__r('/get', {_id:id} );	
	}


	this.queryBuilder = { where:[], limit:{}, order:[], paginate:{} };
	this.query = function () {
		this.queryBuilder = { where:[], limit:{}, order:[], paginate:{} };
		return this;
	}



		this.where = function( field, exp, value ) {

			this.queryBuilder['where'].push({op:'and', field:field, exp:exp, value:value});

			return this;
		}


		this.orWhere = function( field, exp, value ) {

			this.queryBuilder['where'].push({op:'or', field:field, exp:exp, value:value});
			return this;
		}

		this.orwhere = this.orWhere;

		this.orderBy = function(field, order ) {
			this.queryBuilder['order'].push({ field:field, order:order});
			return this;
		}

		this.orderby = this.orderBy;

		this.limit = function( from, limit ) {

			if ( arguments.length == 1 ) {
				limit = from;
				from = null;
			}
			this.queryBuilder['limit'] = { limit:limit, from:from};
			return this;
		}

		//->paginate(4,['_id'], '/index.php?a=100&page=', 1 )
		this.paginate = function(  perpage, page, link, fields ) {
			fields = fields || ['_id'];
			link = link || null;
			page = page || 1;
			perpage = perpage || 20;
			this.queryBuilder['paginate'] = { perpage:perpage, fields:fields, link:link, page:page};
			return this;
		}

		this.fetch = function() {
			return this.__r('/query', {fields:arguments, query:this.queryBuilder});
		}





	/**
	 * 创建数据表结构  ( 需管理员权限 )
	 * @param  object schema        数据表结构体
	 * @param  bool dropIfExist     如果存在则删除数据表 默认为 false
	 * @return Promise
	 */
	this._schema = function( schema, dropIfExist ) {
		dropIfExist = dropIfExist || false;
		return this.__r('/schema', {schema:schema, dropIfExist:dropIfExist} );
	}


	/**
	 * 删除数据表 ( 需管理员权限 )
	 * @param bool checkExist 检查数据表是否存在,  默认 false 不存储则忽略
	 * @return Promise
	 */
	this._clear = function( checkExist ) {
		checkExist = checkExist || false;
		return this.__r('/clear', {} );
	}



	/**
	 * 请求远程 API 
	 * @param  string api    api 地址
	 * @param  object data   post 数据
	 * @param  object header 请求 Header
	 * @return Promise
	 */
	this.__r = function( api, data, header ) {

		var that = this;
		header = header || {'content-type': 'application/json' };
		data = data || {}
		api = api || 'index';
		data['_sid'] = that.ss.id();
		data['_table'] = that.table_name;
		data['_prefix'] = that.prefix;
		
		// data['_input'] = JSON.stringify( data );

		return new Promise(function (resolve, reject) {
			wx.request({
				url: that.api + api,
				data: data, // 
				header: header,
				method: 'POST',
				success: function (res){

					var resp  = res.data || {};
					if ( typeof resp['code'] == 'undefined' ) {
						res['__api'] = api;
						reject( new Excp( api + ' API Error', res.statusCode, res));
						return;
					} else if (  resp['code'] != 0 ) {
						resp['message'] = resp['message'] || 'Undefined Error';
						resp['extra'] = resp['extra'] || resp;
						resp['extra']['__api'] = api;
						reject( new Excp( resp['message'], resp['code'], resp['extra'] ) );
						return;
					}

					// 返回结果成功
					resolve( resp['result'] );
				},
				fail:function( res ) {
					reject( new Excp(api + ' API Error', 500, res));
				}
			});
		});

	}

}


module.exports = table;