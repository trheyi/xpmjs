if ( typeof Promise == 'undefined' ) { var _P = require('../lib/promise.min.js').Promise; } else { var _P = Promise; }
var Excp = require('excp.js');
var Session = require('session.js');
var Table = require('table.js');
var Utils = require('utils.js');
if ( typeof Promise == 'undefined' ) { var _P = require('../lib/promise.min.js').Promise; } else { var _P = Promise; }

function Card( option )  {

	option = option || {};

	var utils = new Utils( option );
	this.host = option['https'] || option['host'];
	this.api = 'https://' +  this.host + '/_a/baas/card';
	this.ss = new Session( option );
	this.ss.start();

	// 读取卡券列表
	this.list = function() {
		return utils.request('GET', this.api + '/search' );
	}

	// 读取卡券详情
	this.get = function( card_id ) {

	}

	// 添加卡券
	this.add = function( cards ) {

		var that = this;

		return new _P( function(resolve, reject) {

			// 读取卡券扩展信息（以及签名)
			utils.request('POST', that.api + '/getCardsExt', { 'data':{'cards':cards}})

			.then(function( cardList  ) { // 添加卡券
				console.log( cardList );
				wx.addCard({
					cardList:cardList,
					success: function(res) {
					    console.log(res.cardList) // 卡券添加结果
					    resolve(res.cardList);
					},
					fail:function(detail) {
						reject(detail);
					}
				});
			})

			.catch( function( excp){
				reject(excp);
			});
		});
	}


	// 打开卡包中的卡券
	this.open = function( cardList ){
		var that = this;
		return new _P( function(resolve, reject) {
			wx.openCard({
				cardList:cardList,
				success: function(res) {
				    console.log(res) // 卡券打开结果
				    resolve(res);
				},
				fail:function(detail) {
					reject(detail);
				}
			});
		});

	}

	// 核销卡券
	this.consume = function() {

	}



}

module.exports = Card;