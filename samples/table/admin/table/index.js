//获取应用实例

var app = getApp();
var _P = app.xpm.getPromise();

Page({

	data:{
	  table:['goods','order','booking']
	},

	// 商品表 goods
	goods:{
		"schema":[  
			{name:"name", type:'string', option:{length:80, require:true }, acl:"rw:rw:r" },
			{name:"summary", type:'string', option:{length:80 }, acl:"rw:rw:r" },
			{name:"price", type:'integer', option:{length:10, require:true}, acl:"rw:rw:r" },
			{name:"real_price", type:'text', option:{json:true}, acl:"rw:rw:r" },
			{name:"free_price", type:'integer', option:{length:80}, acl:"rw:rw:r" },
			{name:"corver", type:'string', option:{length:200 }, acl:"rw:rw:r" },
			{name:"images", type:'text', option:{json:true}, acl:"rw:rw:r" },
			{name:"body", type:'text', option:{}, acl:"rw:rw:r" },
			{name:"type", type:'string', option:{length:10, index:true }, acl:"rw:rw:r" },
			{name:"status", type:'string', option:{length:10, index:true }, acl:"rw:rw:r" },
			{name:"status_tips", type:'string', option:{ length:200 }, acl:"rw:rw:r" }
		],
		
		"option":{ 
			record:"rwd:rw:r", table:"rwd:rwd:-", field:'rwd:r:-',  user:'admin', group:'manager' 
		},

		"faker": [
			{
				name:'【天虹/坂田/杨美】秦朝·L', 
	            price:1,
	            real_price:{'member':1,'vip':1},
	            corver:'http://of2is3ok3.bkt.clouddn.com/demo/data/g1.jpg',
	            images:['http://of2is3ok3.bkt.clouddn.com/demo/data/g1.jpg'],
	            body:'此处应有正文',
	            type:'goods',
	            status:'online',
	            summary:'仅售238元，价值301元单人资深设计洗剪吹+Baco芭寇有机香草数码烫/直/染+护理！男女通用！',
	            status_tips:'active'   }, 
	        {
				name:'秘密花园·发型定制工作室', 
	            price:1,
	            real_price:{'member':1,'vip':1},
	            corver:'http://of2is3ok3.bkt.clouddn.com/demo/data/g2.jpg',
	            images:['http://of2is3ok3.bkt.clouddn.com/demo/data/g2.jpg'],
	            body:'此处应有正文',
	            type:'goods',
	            status:'online',
	            summary:'仅售288元，价值764元单人美奇丝烫/染/直发（3选1）+洗剪吹套餐，节假通用！免费WiFi！',
	            status_tips:'active'   },
	        {
				name:'佑米造型', 
	            price:1,
	            real_price:{'member':1,'vip':1},
	            corver:'http://of2is3ok3.bkt.clouddn.com/demo/data/g3.jpg',
	            images:['http://of2is3ok3.bkt.clouddn.com/demo/data/g3.jpg'],
	            body:'此处应有正文',
	            type:'goods',
	            status:'online',
	            summary:'仅售29.8元，价值38元单人洗剪吹1份，节假通用，男女通用！',
	            status_tips:'active'   },
	        {
				name:'轩尼丝发型连锁', 
	            price:1,
	            real_price:{'member':1,'vip':1},
	            corver:'http://of2is3ok3.bkt.clouddn.com/demo/data/g4.jpg',
	            images:['http://of2is3ok3.bkt.clouddn.com/demo/data/g4.jpg'],
	            body:'此处应有正文',
	            type:'goods',
	            status:'online',
	            summary:'仅售179元，价值834元单人蚕丝蛋白烫发／可丽丝染发＋韩国可儿护理（2选1）！男女通用！',
	            status_tips:'active'   },
	        {
				name:'尚艺美发', 
	            price:1,
	            real_price:{'member':1,'vip':1},
	            corver:'http://of2is3ok3.bkt.clouddn.com/demo/data/g5.jpg',
	            images:['http://of2is3ok3.bkt.clouddn.com/demo/data/g5.jpg'],
	            body:'此处应有正文',
	            type:'goods',
	            status:'online',
	            summary:'仅售268元，价值1166元单人施华蔻美发套餐，免费停车位，男女通用！',
	            status_tips:'active'   },
	        {
				name:'MVP HAIR SALON', 
	            price:1,
	            real_price:{'member':1,'vip':1},
	            corver:'http://of2is3ok3.bkt.clouddn.com/demo/data/g6.jpg',
	            images:['http://of2is3ok3.bkt.clouddn.com/demo/data/g6.jpg'],
	            body:'此处应有正文',
	            type:'goods',
	            status:'online',
	            summary:'仅售29.9元，价值128元洗剪吹--单人首席设计师裁剪1次，节假通用！新店开业钜惠，欢迎体验！',
	            status_tips:'active'   },

	        {
				name:'V时尚', 
	            price:1,
	            real_price:{'member':1,'vip':1},
	            corver:'http://of2is3ok3.bkt.clouddn.com/demo/data/g7.jpg',
	            images:['http://of2is3ok3.bkt.clouddn.com/demo/data/g7.jpg'],
	            body:'此处应有正文',
	            type:'goods',
	            status:'online',
	            summary:'仅售399元，价值3719元单人施华蔻专业烫发/染发/直发3选1套餐，节假通用！男女通用！',
	            status_tips:'active'   },

	        {
				name:'so伊然发型设计工作室', 
	            price:1,
	            real_price:{'member':1,'vip':1},
	            corver:'http://of2is3ok3.bkt.clouddn.com/demo/data/g8.jpg',
	            images:['http://of2is3ok3.bkt.clouddn.com/demo/data/g8.jpg'],
	            body:'此处应有正文',
	            type:'goods',
	            status:'online',
	            summary:'仅售298元，价值1636元单人烫/染2选1，节假通用，男女通用！',
	            status_tips:'active'   },

	        {
				name:'美联社&镁连社', 
	            price:1,
	            real_price:{'member':1,'vip':1},
	            corver:'http://of2is3ok3.bkt.clouddn.com/demo/data/g9.jpg',
	            images:['http://of2is3ok3.bkt.clouddn.com/demo/data/g9.jpg'],
	            body:'此处应有正文',
	            type:'goods',
	            status:'online',
	            summary:'仅售288元，价值2140元单人菲灵烫护/染护美发套餐2选1，节假通用，男女通用！',
	            status_tips:'active'   },

	        {
				name:'米粒沙龙', 
	            price:1,
	            real_price:{'member':1,'vip':1},
	            corver:'http://of2is3ok3.bkt.clouddn.com/demo/data/g10.jpg',
	            images:['http://of2is3ok3.bkt.clouddn.com/demo/data/g10.jpg'],
	            body:'此处应有正文',
	            type:'goods',
	            status:'online',
	            summary:'仅售258元，价值2688元单人本FEELING菲灵烫发/染发/直发三选一套餐！节假通用！',
	            status_tips:'active'   },

	        {
				name:'尚巢形象', 
	            price:1,
	            real_price:{'member':1,'vip':1},
	            corver:'http://of2is3ok3.bkt.clouddn.com/demo/data/g11.jpg',
	            images:['http://of2is3ok3.bkt.clouddn.com/demo/data/g11.jpg'],
	            body:'此处应有正文',
	            type:'goods',
	            status:'online',
	            summary:'仅售88元，价值188元女士单人洗剪造型套餐，节假通用！',
	            status_tips:'active'   },

	        {
				name:'蜜拉贝儿私人形象设计工作室', 
	            price:1,
	            real_price:{'member':1,'vip':1},
	            corver:'http://of2is3ok3.bkt.clouddn.com/demo/data/g12.jpg',
	            images:['http://of2is3ok3.bkt.clouddn.com/demo/data/g12.jpg'],
	            body:'此处应有正文',
	            type:'goods',
	            status:'online',
	            summary:'仅售128元，价值168元单人总监设计师洗剪吹套餐1次，节假通用，长短发不限！',
	            status_tips:'active'   },

	        {
				name:'轩尼丝发型连锁', 
	            price:1,
	            real_price:{'member':1,'vip':1},
	            corver:'http://of2is3ok3.bkt.clouddn.com/demo/data/g13.jpg',
	            images:['http://of2is3ok3.bkt.clouddn.com/demo/data/g13.jpg'],
	            body:'此处应有正文',
	            type:'goods',
	            status:'online',
	            summary:'仅售179元，价值834元单人蚕丝蛋白烫发／可丽丝染发＋韩国可儿护理（2选1）！男女通用！',
	            status_tips:'active'   },

	        {
				name:'布卡斯私人工作室', 
	            price:1,
	            real_price:{'member':1,'vip':1},
	            corver:'http://of2is3ok3.bkt.clouddn.com/demo/data/g14.jpg',
	            images:['http://of2is3ok3.bkt.clouddn.com/demo/data/g14.jpg'],
	            body:'此处应有正文',
	            type:'goods',
	            status:'online',
	            summary:'仅售75元，价值100元单人总监洗剪吹，节假通用，免费WiFi，男女通用！长短发不限！',
	            status_tips:'active'   },

	        {
				name:'佛伦斯私人订制烫染国际连锁', 
	            price:1,
	            real_price:{'member':1,'vip':1},
	            corver:'http://of2is3ok3.bkt.clouddn.com/demo/data/g15.jpg',
	            images:['http://of2is3ok3.bkt.clouddn.com/demo/data/g15.jpg'],
	            body:'此处应有正文',
	            type:'goods',
	            status:'online',
	            summary:'仅售88元，价值366元单人剪护套餐，节假通用，男女通用！含首席洗剪吹1次+欧莱雅营养倒膜1次！',
	            status_tips:'active'   }
		]
	},


	// 订单表 order
	order:{
		"schema":[  
			{name:"sn", type:'string', option:{length:128, require:true }, acl:"rw:rw:r" },
			{name:"uid", type:'integer', option:{length:10, require:true}, acl:"rw:rw:r" },
			{name:"storeid", type:'integer', option:{length:20, require:true}, acl:"rw:rw:r" },
			{name:"goods", type:'text', option:{json:true}, acl:"rw:rw:r" },
			{name:"contact", type:'string', option:{ length:80 }, acl:"rw:rw:r" },
			{name:"address", type:'string', option:{ length:200 }, acl:"rw:rw:r" },
			{name:"mobile", type:'string', option:{ length:20 }, acl:"rw:rw:r" },
			{name:"status", type:'string', option:{length:10, index:true }, acl:"rw:rw:r" },
			{name:"status_tips", type:'string', option:{ length:200 }, acl:"rw:rw:r" },
			{name:"remark", type:'string', option:{ length:200 }, acl:"rw:rw:r" },
			{name:"out_trade_no", type:'string', option:{ length:200 }, acl:"rw:rw:r" },
			{name:"prepay_id", type:'string', option:{ length:200 }, acl:"rw:rw:r" },
			{name:"pay_from", type:'integer', option:{ length:10 }, acl:"rw:rw:r" },
			{name:"pay_status", type:'string', option:{ length:200 }, acl:"rw:rw:r" }
		],
		"option":{ 
			record:"rwd:rwd:rw", table:"rwd:rwd:-", field:'rwd:rwd:-',  user:'admin', group:'manager' 
		}
	},

	// 预约表 booking
	booking:{
		"schema":[  
			{name:"sn", type:'string', option:{length:128, unique:true, require:true }, acl:"rw:rw:r" },
			{name:"uid", type:'integer', option:{length:10, require:true}, acl:"rw:rw:r" },
			{name:"goods", type:'text', option:{json:true}, acl:"rw:rw:r" },
			{name:"when", type:'string', option:{ length:100 }, acl:"rw:rw:r" },
			{name:"status", type:'string', option:{length:10, index:true }, acl:"rw:rw:r" },
			{name:"status_tips", type:'string', option:{ length:200 }, acl:"rw:rw:r" },
			{name:"remark", type:'string', option:{ length:200 }, acl:"rw:rw:r" }
		],
		"option":{ 
			record:"rwd:rwd:rw", table:"rwd:rwd:-", field:'rwd:rwd:-',  user:'admin', group:'manager' 
		},

		"faker": [
			{
				sn:'1484565646412901', 
	            uid:1,
	            goods:{"1":{"id":1,"price":1,"amount":1}},
	            when:'2017-2-21 12:00',
	            status:'WAIT_CFM',  //  WAIT_CFM  待确认   SUCCESS   成功   FAIL  失败   DONE   完成
	            status_tips:'',
	            remark:'还去上回的那个房间.' },
	        {
				sn:'2484565646412902', 
	            uid:1,
	            goods:{"4":{"id":4,"price":1,"amount":1}},
	            when:'2017-2-25 13:00',
	            status:'WAIT_CFM',  //  WAIT_CFM  待确认   SUCCESS   成功   FAIL  失败   DONE   完成
	            status_tips:'',
	            remark:'' },
	        {
				sn:'3484565646412903', 
	            uid:1,
	            goods:{"5":{"id":5,"price":1,"amount":1}},
	            when:'2017-2-28 10:00',
	            status:'FAIL',  //  WAIT_CFM  待确认   SUCCESS   成功   FAIL  失败   DONE   完成
	            status_tips:'房间已被预订',
	            remark:'还去上回的那个房间' },
	        {
				sn:'4484565646412904', 
	            uid:1,
	            goods:{"8":{"id":8,"price":1,"amount":1}},
	            when:'2017-2-18 22:00',
	            status:'WAIT_CFM',  //  WAIT_CFM  待确认   SUCCESS   成功   FAIL  失败   DONE   完成
	            status_tips:'',
	            remark:'' },
	        {
				sn:'5484565646412905', 
	            uid:1,
	            goods:{"9":{"id":9,"price":1,"amount":1}},
	            when:'2017-2-18 14:00',
	            status:'SUCCESS',  //  WAIT_CFM  待确认   SUCCESS   成功   FAIL  失败   DONE   完成
	            status_tips:'OK',
	            remark:'还去上回的那个房间' },
	        {
				sn:'6484565646412906', 
	            uid:1,
	            goods:{"10":{"id":10,"price":1,"amount":1}},
	            when:'2017-3-11 13:00',
	            status:'WAIT_CFM',  //  WAIT_CFM  待确认   SUCCESS   成功   FAIL  失败   DONE   完成
	            status_tips:'',
	            remark:'还去上回的那个房间' },
	        {
				sn:'7484565646412907', 
	            uid:1,
	            goods:{"11":{"id":11,"price":1,"amount":1}},
	            when:'2017-4-28 15:00',
	            status:'DONE',  //  WAIT_CFM  待确认   SUCCESS   成功   FAIL  失败   DONE   完成
	            status_tips:'',
	            remark:'还去上回的那个房间' },
	        {
				sn:'8484565646412908', 
	            uid:1,
	            goods:{"12":{"id":12,"price":1,"amount":1}},
	            when:'2017-5-28 16:00',
	            status:'WAIT_CFM',  //  WAIT_CFM  待确认   SUCCESS   成功   FAIL  失败   DONE   完成
	            status_tips:'',
	            remark:'还去上回的那个房间' }
	    ]
	},

	faker: function( event ) {
		var tname = event.target.dataset.name;
		var table = app.xpm.require('Table', tname);
		var tinfo = this[tname] || {};

		if ( typeof tinfo['faker'] != 'undefined' ) {
			this.cdata(table,  tinfo['faker']);
		}

	},

	cdata: function( table, dataset, from ) {

		var that = this;
		from = from || 0;
		dataset = dataset || [];
		var p = [];
		var end = 10 + from;
		if ( end > dataset.length ) {
			end = dataset.length;
		}

		for( var i=from; i<end; i++) {
			p.push(table.create(dataset[i]));
		}	

		_P.all(p).then(values => {
		  
		  console.log('from', from , ' done!');

		  if ( end < dataset.length ) {
		   	return that.cdata( table, dataset, from + 10 );
		  }
		});

	},

	rebuild: function( event ) {

		var tname = event.target.dataset.name;
		var table = app.xpm.require('Table', tname);
		var tinfo = this[tname] || {};

		table._schema(tinfo['schema'], tinfo['option'], true ).then(function( resp ){
			console.log( resp, 'Complete');
		}) 

		.catch( function(excp) {
			console.log( excp, 'error');
		});


	},

	onLoad: function () {
		var user = app.xpm.require('User')
		 user.login().then( function(resp){
			console.log( 'login', 'Complete', resp );

			return user.tab.get( resp['_id']);

		}).then( function(resp) { 

			console.log( resp, 'user')
		})
		
		.catch( function(excp) {
			console.log( excp, 'error');
		});

	}
})






