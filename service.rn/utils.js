let _P = Promise;
import Excp from './excp';

/**
 * 常用工具
 * @param {[type]} option [description]
 */
function Utils( option ) {

	option = option || {};
	this.host = option['https'] || option['host'];
	this.cid =  option.app || '';
	this.appid = option['appid']; // 小程序ID，可不填写
	this.secret = option['secret']; // 云端鉴权 secret 格式为 appid|secret


	/**
	 * 生成一个 Guid
	 * @return GUID
	 */
	this.guid = function(){
		function S4() {
    		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  		}
  		return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
	}


	/**
	 * 暂未实现
	 * @return {[type]} [description]
	 */
	this.utils.upload = function() {
		return new _P((resolve, reject) =>{
			resolve(this);
		});
	}


	/**
	 * 
	 * 发起 Request 请求
	 * 
	 * @param  string method 方法 GET/POST/PUT/DELETE ..
	 * @param  string api API 地址
	 * @param  object data  post data
	 * @param  object option 选项
	 * @return Promise
	 */
	this.request = function( method, api, data, option ) {
		option = option || {};
		option['header'] = option['header'] || {'content-type': 'application/json'};
		option['dataType'] = option['dataType'] || 'json';
		data = data || {};
		var queryAdd = {};
		
		// queryAdd["_sid"] = this.ss.id();
		queryAdd["_cid"] = this.cid;
		queryAdd["_appid"] = this.appid;
		queryAdd["_secret"] = this.secret;

		var query = [], queryString ='';
		for( var field in queryAdd ) {
			query.push(field + '=' + queryAdd[field]);
		}

		var queryString = query.join('&');

		if ( api.indexOf('?') === -1 ) {
			api = api + '?' + queryString;
		} else {
			api = api + '&' + queryString;
		}

		// 删除 null 值
		for ( var field in data ) {
			if ( data[field] == null ) {
				delete data[field];
			}
		}

		return new _P((resolve, reject) =>{
			console.log('request called');
			resolve(this);
		});


		return new _P(function (resolve, reject) {
			wx.request({
				url: api,
				data: data, 
				header: option['header'],
				method: method,
				success: function (res){

					if ( res.statusCode != 200 ) {
						reject(new Excp('请求API失败', res.statusCode, {
							res:res,
							method:method, 
							api:api, 
							data:data, 
							option:option
						}));
						return;
					}

					res['data'] = res['data'] || {};
					
					if ( typeof res['data']['code']  != null && typeof res['data']['code'] != 'undefined' && typeof res['data']['message'] != 'undefined' &&  res['data']['code']  != 0 ) {

					   res.data = res.data || {};
				       var message = res.data.message || '请求API失败';
				       if ( typeof res.data == 'string' ) {
				       		message = res.data;
				       }

						reject(new Excp( message, 500, {
							res:res,
							method:method, 
							api:api, 
							data:data, 
							option:option
						}));
						return;
					}

					if ( typeof res['data'] != 'object' && option['dataType'] == 'json') {

					   res.data = res.data || {};
				       var message = res.data.message || '请求API失败';
				       if ( typeof res.data == 'string' ) {
				       		message = res.data;
				       }

						reject(new Excp(message,500, {
							res:res,
							method:method, 
							api:api, 
							data:data, 
							option:option
						}));
						return;
					}
					resolve( res['data'] );
				},

				fail: function (res) { 
					reject(new Excp('请求API失败',500, {
						res:res,
						method:method, 
						api:api, 
						data:data, 
						option:option
					}));
				}
			});
		});
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
	
		if ( typeof start == 'string') {
			start = start.replace(/-/g, "/");
		}

		if ( typeof end == 'string') {
			end = end.replace(/-/g, "/");
		}

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
	 * 检查变量是否为空
	 * @param  mix obj string/number/object/array
	 * @return boolen 为空返回 true 否则返回 false
	 */
	this.empty = function( obj ) {

		if ( typeof obj == 'undefined' ) {
			return true;
		} else if ( typeof obj == 'string' && obj == '' ) {
			return true;
		} else if ( typeof obj == 'object' && Object.keys(obj).length == 0 ) {
			return true;
		} else if ( typeof obj == 'number' && Number.isNaN(obj) ) {
			return true;
		}

		return false;

	}


	/**
	 * 合并多个Object 
	 * @param  Object  n1, n2...  待合并的 Object
	 * @return Object 
	 */
	this.merge = function() {

	    var to = new Object();

	    // 遍历剩余所有参数
	    for (var i = 0; i < arguments.length; i++) {
	      var nextSource = arguments[i];
	      // 参数为空，则跳过，继续下一个
	      if (nextSource === undefined || nextSource === null) {
	        continue;
	      }
	      nextSource = Object(nextSource);

	      // 获取改参数的所有key值，并遍历
	      var keysArray = Object.keys(nextSource);
	      for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
	        var nextKey = keysArray[nextIndex];
	        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
	        // 如果不为空且可枚举，则直接浅拷贝赋值
	        if (desc !== undefined && desc.enumerable) {
	          to[nextKey] = nextSource[nextKey];
	        }
	      }
	    }

	    return to;
	}



}

module.exports = Utils;