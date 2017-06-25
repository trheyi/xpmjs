if ( typeof Promise == 'undefined' ) { var _P = require('../lib/promise.min.js').Promise; } else { var _P = Promise; }
var Excp = require('excp.js');
var Session = require('session.js');

function table( option, table_name ) {

	option = option || {};

	this.host = option['https'] || option['host'];
	this.prefix= option['table.prefix'] || '';
	this.api = 'https://' +  this.host + '/_a/baas/table';
	this.table_name = table_name || null;
	this.queryBuilder = { 
			where:[], 
			limit:{}, 
			order:[], 
			paginate:{}, 
			join:[], 
			leftjoin:[],
			rightjoin:[],
			group:{},
			having:[],
			inwhere:{}
	};
	this.sync = false;
	this.ss = new Session( option );
	this.ss.start();
	this.cid =  option.app || '';
	

	/**
	 * 返回数据表全名
	 * @return string table_fullname
	 */
	this.table = function() {
		return '_baas_' +  this.prefix + '_' +  this.table_name;
	}


	/**
	 * 创建一条记录
	 * @param  object data 记录数据 ( Key-Value 结构)
	 * @return Promise
	 */
	this.create = function( data ) {
		return this.__r('/create', {data:data} );
	}


	/**
	 * 根据数据表ID, 更新一条记录
	 * @param  int id 数据表ID
	 * @param  object data 记录数据 ( Key-Value 结构)
	 * @return Promise
	 */
	this.update = function( id, data ) {
		return this.__r('/update', {_id:id, data:data} );
	}


	/**
	 * 使用数据表唯一键，创建一条记录
	 * @param  string uni_key 唯一键字段名称
	 * @param  object data 记录数据 ( Key-Value 结构)
	 * @return Promise
	 */
	this.updateBy = function( uni_key, data ) {
		return this.__r('/updateby', {uni_key:uni_key, data:data} );	
	}



	/**
	 * 根据数据表唯一键数值，删除一条记录
	 * @param  string data_key 唯一键数值
	 * @param  string uni_key  唯一键字段名称
	 * @return Promise
	 */
	this.remove = function( data_key, uni_key ){
		uni_key = uni_key || '_id';
		return this.__r('/remove', {data_key:data_key, uni_key:uni_key});
	}


	/**
	 * 查询数据表， 返回一组记录和总数 {data:[], total:100}
	 * @param  string where 查询条件, 从 where 开始 ( eg: "where name=? " )
	 * @param  array  data 动态数据 ( eg: where = "where name=? or name=? ", data= ["张艺谋", "冯小刚"] 拼接后的 SQL: where name='张艺谋' or name='冯小刚' )
	 * @param  array fields 返回字段清单,默认为 [] 返回所有字段
	 * @return Promise
	 */
	this.select = function( where, data, fields ) {
		fields = fields || [];
		data = data || [];
		where = where || "";
		return this.__r('/select', {query:where, data:data, fields:fields});
	}


	/**
	 * 查询数据表，返回一组记录 
	 * @param  string where 查询条件, 从 where 开始 ( eg: "where name=? " )
	 * @param  array  data 动态数据 ( eg: where = "where name=? or name=? ", data= ["张艺谋", "冯小刚"] 拼接后的 SQL: where name='张艺谋' or name='冯小刚' )
	 * @param  array fields 返回字段清单,默认为 [] 返回所有字段
	 * @return Promise
	 */
	this.getData = function ( where, data, fields ) {

		fields = fields || [];
		data = data || [];
		where = where || "";
		return this.__r('/getdata', {query:where, data:data, fields:fields});

	}

	/**
	 * 查询数据表, 返回一行数据
	 * @param  string where 查询条件, 从 where 开始 ( eg: "where name=? " )
	 * @param  array  data 动态数据 ( eg: where = "where name=? or name=? ", data= ["张艺谋", "冯小刚"] 拼接后的 SQL: where name='张艺谋' or name='冯小刚' )
	 * @param  array fields 返回字段清单,默认为 [] 返回所有字段
	 * @return Promise
	 */
	this.getLine = function ( where, data, fields ) {

		fields = fields || [];
		data = data || [];
		where = where || "";
		return this.__r('/getline', {query:where, data:data, fields:fields});

	}


	/**
	 * 查询数据表, 返回一个字段数值
	 * @param  string where 查询条件, 从 where 开始 ( eg: "where name=? " )
	 * @param  array  data 动态数据 ( eg: where = "where name=? or name=? ", data= ["张艺谋", "冯小刚"] 拼接后的 SQL: where name='张艺谋' or name='冯小刚' )
	 * @param  array fields 返回字段清单,默认为 [] 返回所有字段
	 * @return Promise
	 */
	this.getVar = function( field,  where, data ) {

		field = field || '_id';
		data = data || [];
		where = where || "";
		return this.__r('/getvar', {query:where, data:data, field:field});
	}

	
	

	/**
	 * 下一个自增ID 数值
	 * @return Promise
	 */
	this.nextid = function() {
		return this.__r('/nextid', {});	
	}

	/**
	 * 根据数据表 ID, 查询一条数值
	 * @param int id 数据表ID
	 * @return Promise
	 */
	this.get = function( id ) {
		return this.__r('/get', {_id:id} );	
	}



	
	/**
	 * 查询语句构造器
	 *
	 * 	tb.query()
     *      .where('name', '=', '冯小刚')
     *      .orderby('name', 'asc')
     *      .limit(2)  // 仅查询 2条 
     *      .fetch('name','company');  // 读取字段
     *      
	 *  tb.query()
     *   .where('name', '=', '张艺谋')
     *   .orwhere('name', '=', '冯小刚')
     *   .orderby('name', 'desc')
     *   .paginate(3, 2)  // 分3页，当前显示第 2页 
     *   .fetch('name','company');    // 读取字段
     *         
	 * @return this
	 */
	this.query = function () {
		this.queryBuilder = { 
			where:[], 
			limit:{}, 
			order:[], 
			paginate:{}, 
			join:[], 
			leftjoin:[],
			rightjoin:[],
			group:{},
			having:[],
			inwhere:{}
		};
		return this;
	}



		/**
		 * 构造查询条件
		 * @param  string  field 字段名称
		 * @param  string  exp   关系操作符 ( =, <> , > , <, like ... )
		 * @param  string  value 字段数值 
		 * @return this 
		 */
		this.where = function( field, exp, value ) {
			this.queryBuilder['where'].push({op:'and', field:field, exp:exp, value:value});
			return this;
		}


		/**
		 * 构造查询条件 ( Or 关系 )
		 * @param  string  field 字段名称
		 * @param  string  exp   关系操作符 ( =, <> , > , <, like ... )
		 * @param  string  value 字段数值 
		 * @return this 
		 */
		this.orWhere = function( field, exp, value ) {

			this.queryBuilder['where'].push({op:'or', field:field, exp:exp, value:value});
			return this;
		}

		this.orwhere = this.orWhere; 


		/**
		 * 构造 Order 查询
		 * @param  string field 字段名称
		 * @param  string  order 排序呢方法 ( asc / desc )
		 * @return this
		 */
		this.orderBy = function(field, order ) {
			this.queryBuilder['order'].push({ field:field, order:order});
			return this;
		}

		this.orderby = this.orderBy;


		this.groupBy = function( field ) {
			this.queryBuilder['group'] = {field:field};
			return this;
		}

		this.groupby = this.groupBy;

		this.having = function( field, exp, value ) {
			this.queryBuilder['having'].push(
				{ field:field, exp:exp, value:value}
			);
			return this;
		}


		/**
		 * 构造 Limit 查询
		 * 
		 * td.limit(10)      //最多返回10条记录 
		 * td.limit(2, 10);  // 从第2条记录开始，最多返回10条记录
		 * 
		 * @param  int from 记录偏移量 （  如 limit 为空, from 为记录最大值  )
		 * @param  int limit 记录最大值
		 * @return this
		 */
		this.limit = function( from, limit ) {

			if ( arguments.length == 1 ) {
				limit = from;
				from = null;
			}
			this.queryBuilder['limit'] = { limit:limit, from:from};
			return this;
		}

		
		/**
		 * 构造分页查询
		 * @param  int perpage 每页显示记录数量, 默认 20
		 * @param  int page 当前页， 默认为 1
		 * @param  string link 分页链接，默认为 null
		 * @param  array fields 计算记录总数时查询字段, 默认为 ['_id'] （ 一般无需修改 )
		 * @return this
		 */
		this.paginate = function(  perpage, page, link, fields ) {
			fields = fields || ['_id'];
			link = link || null;
			page = page || 1;
			perpage = perpage || 20;
			this.queryBuilder['paginate'] = { perpage:perpage, fields:fields, link:link, page:page};
			return this;
		}


		/**
		 * inWhere 查询
		 *
		 *  Table 1: User
		 *  id  |  name | title
		 *  :=: |  :=:  | :=: 
		 *  1   |  张三  | 产品经理
		 *  2   |  李四  | 工程师
		 *  3   |  王五  | 运维工程师
		 *  
		 *  Table 2: Project
		 *  id  |  name | users 
		 *  :=: |  :=:  | :=: 
		 *  1   |  小程序开发组 | ["1","2","3"]
		 *  2   |  网页开发组  | ["1", "3"]
		 *
		 *  ProjectTable.query()
		 *  	 .inWhere('users', 'User', 'id', '*' )
		 *  .fetch('*').then(function( data) {
		 *  	console.log( data );
		 *  })
		 *
		 *  查询结果
		 *  [
		 *  	...
		 *  	{
		 *  		"id":1,
		 *  		"name":"小程序开发组"
		 *  		"users":[
		 *  			...
		 *  			{
		 *  				"id":1,
		 *  				"name":"张三",
		 *  				"title":"产品经理"
		 *  			}
		 *  			...
		 *  		]
		 *  		
		 *  	}
		 *  	...
		 *  ]
		 *  
		 * @param  string field      JSON字段
		 * @param  string whereTable 查询数据表
		 * @param  string whereField 关联数据表的字段
		 * @param  string getFields  关联数据表的数据总量
		 * @return this
		 */
		this.inWhere = function( field,  whereTable, whereField, getFields ) {
			
			getFields = getFields || ['*'];
			whereField = whereField || '_id';

			this.queryBuilder['inwhere'][field] = { 
				field:field, table:whereTable,  where:whereField, fields:getFields
			};

			return this;

		}

		this.inwhere = this.inWhere;


		/**
		 * join 
		 *
		 *  Table 1: User
		 *  id  |  name | title
		 *  :=: |  :=:  | :=: 
		 *  1   |  张三  | 产品经理
		 *  2   |  李四  | 工程师
		 *  3   |  王五  | 运维工程师
		 *  
		 *  Table 2: Project
		 *  id  |  name | uid 
		 *  :=: |  :=:  | :=: 
		 *  1   |  小程序开发组 | 1
		 *  2   |  网页开发组  | 3
		 *
		 *  ProjectTable.query()
		 *  	 .join('User', 'User.id', '=', 'Project.uid' )
		 *  	 .limit(1)
		 *  .fetch('User.id as userid', 'User.name as username', 'Project.*').then(function( data) {
		 *  	console.log( data );
		 *  })
		 *
		 *  查询结果
		 *  [
		 *  	{
		 *  		"id":1,
		 *  		"name":"小程序开发组"
		 *  		"userid":1,
		 *  		"username":"产品经理"
		 *  		
		 *  	}
		 *  ]
		 *  
		 * @param  string table 关联表名称
		 * @param  string field 表一关联字段
		 * @param  string exp   关系操作符 ( =, <> , > , <, like ... )
		 * @param  string value 表二关联字段
		 * @return this
		 */
		this.join = function( table, field, exp, value) {
			this.queryBuilder['join'].push(
				{table:table, field:field, exp:exp, value:value}
			);
			return this;
		}

		/**
		 * leftJoin 
		 * @param  string table 关联表名称
		 * @param  string field 表一关联字段
		 * @param  string exp   关系操作符 ( =, <> , > , <, like ... )
		 * @param  string value 表二关联字段
		 * @return this
		 */
		this.leftJoin = function( table, field, exp, value) {
			this.queryBuilder['leftjoin'].push(
				{table:table, field:field, exp:exp, value:value}
			);
			return this;
		}

		this.leftjoin = this.leftJoin;

		/**
		 * rightJoin 
		 * @param  string table 关联表名称
		 * @param  string field 表一关联字段
		 * @param  string exp   关系操作符 ( =, <> , > , <, like ... )
		 * @param  string value 表二关联字段
		 * @return this
		 */
		this.rightJoin = function( table, field, exp, value) {
			this.queryBuilder['rightjoin'].push(
				{table:table, field:field, exp:exp, value:value}
			);
			return this;
		}

		this.rightjoin = this.rightJoin;



		/**
		 * 执行数据查询
		 * @return Promise 
		 */
		this.fetch = function() {
			var fields = arguments;
			if ( fields.length == 0  ) fields = ['*'];
			return this.__r('/query', {fields:fields, query:this.queryBuilder});
		}



	/**
	 * 运行 SQL ( 需管理员权限 )
	 * @param  string sql 完整的 SQL  ( eg: "UPDATE tab_name SET name=? WHERE id=? " )
	 * @param  array  data 动态数据 ( eg: where = "UPDATE tab_name SET name=? WHERE id=? ", data= ["张艺谋", 1] 拼接后的 SQL: UPDATE tab_name SET name='张艺谋' WHERE id=1 )
	 * @param  bool ret 是否返回查询结果，默认 false , 仅返回是否查询成功
	 * @return Promise
	 */
	this._run = function ( sql, data, ret  ) {
		sql = sql || "";
		ret = ret || false;
		data = data || [];
		return this.__r('/runsql', {sql:sql, data:data, return:ret});
	}


	/**
	 * 创建数据表结构  ( 需管理员权限 )
	 * @param  object schema        数据表结构体
	 * @param  object acl  数据表权限声明
	 * @param  bool dropIfExist     如果存在则删除数据表 默认为 false
	 * @return Promise
	 */
	this._schema = function( schema, acl,  dropIfExist ) {
		dropIfExist = dropIfExist || false;
		acl = acl || {};
		return this.__r('/schema', {schema:schema, acl:acl, dropIfExist:dropIfExist} );
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
	 * 设定/查询数据表鉴权 ( 需要管理员权限 )
	 * @param  object acl 鉴权, 为空返回当前鉴权信息
	 * @return Promise
	 */
	this._acl = function(  acl, name ) {

		name = name || '{record}';  // {table} / {record} / field_name
		return this.__r('/acl', {name:name, acl:acl} );
	}




	/**
	 * 转成同步函数 ( 暂未实现  )
	 * 
	 * @计划实现如下写法: 
	 * 
	 * 	 var resp = tb.sync().create();
	 * 	 var resp = tb.sync().query()->where("name=?",[100])->fetch('name');
	 * 	 ...
	 * 	 
	 * @return this.syncMethods
	 */
	
	this.sync = function() { 
		this.sync = true;
		return this;
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
		data['_cid'] = that.cid;
		data['_table'] = that.table_name;
		data['_prefix'] = that.prefix;
		
		// data['_input'] = JSON.stringify( data );

		return new _P(function (resolve, reject) {
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