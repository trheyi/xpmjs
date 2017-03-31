//获取应用实例

var app = getApp();
var _P = app.xpm.getPromise();
var card = app.xpm.require('card');



Page({

	data:{
	  cards:[]
	},

	getCardList: function() {
		return card.list();
	},

	addCard: function( e ) {

		var cardId = e.target.dataset.id;
		card.add( [{cardId:cardId,code:''}] ).then(function( resp ){
			console.log( resp );
		})
		.catch(function(excp){
			console.log( excp );
		});
	},

	openCard: function( e ) {

		var cardId = e.target.dataset.id;
		card.open( [{cardId:cardId,code:''}] ).then(function( resp ){
			console.log( resp );
		})
		.catch(function(excp){
			console.log( excp );
		});
	},



	onLoad: function () {
		var that = this;
		var user = app.xpm.require('User');

		user.login().then( function(resp){
			console.log( 'login', 'Complete', resp );
			return that.getCardList();

		}).then( function(resp) { 
			that.setData({cards: resp});
		})
		.catch( function(excp) {
			console.log( excp, 'error');
		});

	}
})






