if ( typeof Promise == 'undefined' ) { var _P = require('../lib/promise.min.js').Promise; } else { var _P = Promise; }
var Session = require('session.js');
var Excp = require('excp.js');
var Stor = require('stor.js');

/**
 * 常用工具
 * @param {[type]} option [description]
 */

function Utils( option ) {

	option = option || {};
    this.ss = new Session( option );
    this.stor = new Stor( option );
	this.host = option['https'] || option['host'];
	this.cid =  option.app || '';


	// 1.5.1 新增: 用户数据处理云端应用
	this.appid = option['appid']; // 小程序ID，可不填写
	this.secret = option['secret']; // 云端鉴权 secret 格式为 appid|secret


	/**
	 * 上传任务清单
	 * @type
	 */
	this.uploadTasks = [];


	this.send = function( data ) {
		var api  = 'https://' +  this.host + '/_a/baas/utils/send';
			data = data || {};
		return this.request( 'POST', api, data);
	}


	/**
	 * 获取小程序页面二维码 ( 1.0  RC6 )
	 * @param  string path 小程序页面
	 * @param  number width 二维码的宽度 默认 430
	 */
	this.qrcode = function( path, width, option ) {
		option = option || {};
		var api  = 'https://' +  this.host + '/_a/baas/utils/pageqr';
		width = width || 430;

		var query = option || {}, queryString = [];
		query['path'] = escape(path);
		query['width'] = width;
		query["_sid"] = this.ss.id();
		query["_cid"] = option['app'] || this.cid;

		for( var key in query  ) {
			queryString.push( key + '=' + query[key]);
		}
		return api + '?' + queryString.join('&');

	}


	/**
	 * 获取二维码地址 ( 1.0 RC5 )
	 * @param  string content 二维码内容
	 * @param  object option 配置项
	 *         number option.size   大小(长宽) 默认 300 
	 *         number option.padding  边距  默认 10 
	 *         string option.foreground  前景色 默认 '0,0,0,0' r,g,b,a 白色不透明
	 *         string option.background  背景色 默认  '255,255,255,0' r,g,b,a 黑色不透明
	 *         string option.font  字体 默认 'LantingQianHei.ttf'  有效值 ('elephant.ttf'/'LantingQianHei.ttf'/'LantingHei.ttc'/'STHeitiLight.ttc'/'STHeitiMedium.ttc')
	 *         number option.fontsize  字体大小 默认 14
	 *         string option.label  底部标签名称 默认 '扫描二维码'
	 *         
	 * @return string 二维码图片地址
	 */
	this.qrImageUrl = function( content, option ) {
		var api  = 'https://' +  this.host + '/_a/baas/utils/qrcode';
		var query = option || {}, queryString = [];
		query['code'] = escape(content);
		query['size'] = query['size'] || 300;
		query['padding'] =  query['padding'] || 10;
		query['foreground'] = query['foreground']  || '0,0,0,0';
		query['background'] = query['background']  || '255,255,255,0';
		query['font'] = query['font']  || 'LantingQianHei.ttf';
		query['fontsize'] = query['fontsize']  || 14;
		query['label'] = query['label']  || '扫描二维码';
		query["_sid"] = this.ss.id();
		query["_cid"] = this.cid;

		for( var key in query  ) {
			queryString.push( key + '=' + query[key]);
		}
		return api + '?' + queryString.join('&');

	}


	/**
	 * 生成一个 Guid
	 * @return GUID
	 */
	this.guid = function(){
		
		function S4() {
    		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  		}
  		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}


	/**
	 * 抓取远程地址
	 * 
	 * @param  string url 地址
	 * @param  object option 请求选项
	 * 
	 * @param  string option.method 请求方法 GET/POST/PUT/DELETE
	 * @param  object option.query  GET 参数
	 * @param  object option.data   POST 参数
	 * @param  object option.header   Request Header
	 * @param  string option.type     HTTP REQUEST TYPE 默认为 form . 有效数值 form/json/raw/media
	 * @param  string option.datatype HTTP RESPONSE TYPE 默认为 html. 有效值 json/html/auto/xml  
	 *
	 * 
	 * @return Promise
	 */
	this.fetch = function ( url, option ) {

		var api  = 'https://' +  this.host + '/_a/baas/route/url';
			option = option || {};
			option['datatype'] = option['datatype'] || 'html';
			option['type'] =  option['type'] || 'form';
			option['header'] = option['header']  || {};
			
		return this.request( 'POST', api, {
			'url': url,
			'method':option['method'] || 'GET',
			'option':option || {}
		}, {
			'dataType': option['datatype'] || 'text',
			'header': option['header'] 
		});

	}


	/**
	 * 上传文件到云端
	 * @param  string tmpFile 上传文件资源的路径
	 * @param  string api     云端API地址
	 * @param  string name     文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
	 * @param  object data    formData
	 * @param  object option 选项
	 * @return Promise
	 */
	this.upload = function( tmpFile, name, api, data, option ) {
		
		var that = this;

		option = option || {};
		data = data || {};
		option['header'] = option['header'] || {'content-type': 'application/json'};
		option['dataType'] = option['dataType'] || 'json';

		var queryAdd = {};
		
		queryAdd["_sid"] = this.ss.id();
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


		return new _P(function (resolve, reject) {
			that.uploadTasks[name] = wx.uploadFile({
				url:api,
				filePath:tmpFile,
				name:name,
				formData:data,
				header:option['header'],
				success:function(res){

					if ( res.statusCode != 200 ) {
						reject(new Excp('上传文件失败', res.statusCode, {
							res:res,
							tmpFile:tmpFile, 
							name:name, 
							api:api, 
							data:data, 
							option:option
						}));
						return;
					}

					if ( typeof res['data'] == 'string' && option['dataType'] == 'json') {

						try { res['data'] = JSON.parse(res['data']) } catch(e){
							reject(new Excp('上传文件失败 ' + e.message ,500, {
								res:res,
								tmpFile:tmpFile, 
								name:name, 
								type:typeof res['data'],
								api:api, 
								data:data, 
								option:option
							}));
						}

					}

					if ( typeof res['data'] != 'object' && option['dataType'] == 'json') {
						reject(new Excp('上传文件失败 Json Error',500, {
							res:res,
							tmpFile:tmpFile, 
							name:name, 
							type:typeof res['data'],
							api:api, 
							data:data, 
							option:option
						}));
						return;
					}

					if ( typeof res['data']['code'] != 'undefined' &&  res['data']['code']  != 0 ) {
						res['data']['message'] = res['data']['message'] || 'Server Gone';

						reject(new Excp('上传文件失败 ' + res['data']['message'],500, {
							res:res,
							tmpFile:tmpFile, 
							name:name, 
							api:api, 
							data:data, 
							option:option
						}));
						return;
					}

					resolve( res['data'] );

				},
				fail:function(res){
					reject(new Excp('上传文件失败',500, {
						res:res,
						tmpFile:tmpFile, 
						name:name, 
						api:api, 
						data:data, 
						option:option
					}));
				},
				complete: function(res){
					delete that.uploadTasks[name];
				}
			});

			// + 进度提示
			if ( typeof option['onProgressUpdate'] == 'function') {
				that.uploadTasks[name].onProgressUpdate((res) => {
					option['onProgressUpdate'](res);
				});
			}

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
		
		queryAdd["_sid"] = this.ss.id();
		queryAdd["_cid"] = this.cid;
		queryAdd["_appid"] = this.appid;
        queryAdd["_secret"] = this.secret;
        
        // Cookies
        var _client_token = this.stor.getSync('_client_token');
        if ( _client_token != null ){
            var later30yrs = new Date(new Date().setFullYear(new Date().getFullYear() + 30));
            var expires = later30yrs.toUTCString();
            option['header']['cookie'] = `__client_token=${_client_token}; path=/; domain=.${this.host}; Expires=${expires};`
        }
        // console.log( ' request', option['header']['cookie']  );

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

	/**
	 * 获取当前的地理位置
	 * @param  string type 默认为 wgs84  返回 gps 坐标
	 * @return Promise
	 */
	this.getLocation = function( type ) {

		type = type || 'wgs84';
		return new _P(function (resolve, reject) {
			wx.getLocation({
				type:type,
				success:function( data ) {
					resolve(data);
					return;
				},

				fail: function( res ) {
					reject(new Excp('调用地位信息失败',500, {
						res:res,
						type:type
					}));
					return;
				}
			});
		});
	}


	/**
	 * 打开地图选择位置
	 * @return Promise
	 */
	this.chooseLocation = function() {

		return new _P(function (resolve, reject) {
			wx.chooseLocation({

				success:function( data ) {
					resolve(data);
					return;
				},

				fail: function( res ) {
					if ( res.errMsg=='chooseLocation:fail cancel') {
						reject(new Excp('用户取消调用',501, {
							res:res
						}));

					} else {
						reject(new Excp('打开地图选择位置接口失败',500, {
							res:res
						}));
					}
					return;
				}
			});
		});
	}

}

module.exports = Utils;