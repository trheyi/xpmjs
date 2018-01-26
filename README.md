XpmJS - 小程序云端增强 SDK 
================

## 最近更新

### + React Native Support ( xpmse 1.6.5 + )

`xpm.js` 配置

```javascript
import xpm from './xpmjs/xpm.rn';
let host = 'wss.xpmjs.com';
let option = {
    'app':1,
    'host':host,
    'https':host,
    'wss': host + '/ws-server',
    'table.prefix': '{none}',
    "appid": "wx0550a96041cf486c",
    "secret":"151187416275946|0516fa148c2584028ee4a30157bfdc27",
    "user":"/xpmsns/user/user/wxappLogin"
}

xpm.option(option);
export default xpm;
```

`Home.js` JSX


```javascript
// ...
import xpm from './xpm';
// ...


/**
 * 页面数据驱动
 */
class __data {

  @observable articles = [];
  @observable loading = false;
  @observable curr = null;

  constructor() {
     // mobx.autorun(() => console.log('auto run', this.page));
  }


  fetch( key = null ) {
    this.loading = true;

    let $search = xpm.api('/xpmsns/pages/article/search');
    $search().get({perpage:20, page:2}).then(( resp )=>{
      console.log( resp );
      this.articles = resp;
    }).catch( (excp) => {
      console.log( 'excp:',  excp );
    });
  }

}

// ....

```



### + config 更新 ( xpmjs-server 1.5.2+ )

```javascript
var host = 'wss.xpmjs.com';
var option = {
    'app':1,
    'host':host,
    'https':host,
    'wss': host + '/ws-server',
    'table.prefix': 'demo',
    'user.table':'user', 
    "appid": "wx0550a96041cf486c",  // 新增
    "secret":"150698766059529|4990e4107dbfe85c045cf8bbd3508652",  // 服务端  appid & secret
    "user" : "/mina/user/user/wxappLogin" // 新增用户系统 handler api
}

var xpm = require('xpmjs/xpm.js').option(option);
```

### + api 调用云端应用API (  xpmjs-server 1.5.2+ )
 
```javascript
var $test = app.xpm.api('mina/user/user/test');

$test({hello:'world'}).get()

.then(function(resp){
    console.log( resp );
})
.catch( function(excp){
    console.log('excp', excp);
});

```

### + MINA WEB (预览版)

文档: http://book.tuanduimao.com/357326



## 一、XpmJS 是啥

XpmJS可以链接任何云端资源，为小程序、移动应用提供云资源通道和后端能力。降低开发门槛，提升小程序的开发效率。无需编写后端代码，即可实现用户登录、WebSocket 通信、微信支付、云端数据表格、文件存储等功能。虽然 PHP 是最好的编程语言, 但是使用 XpmJS 后, 无需学习包括 PHP 在内的任何后端语言，**用 Javascript 即可搞定一切，NodeJS 也不用！**


## 二、为啥 XpmJS

### 从代码结构上看 XpmJS 更优雅！因为使用了 Promise！ 

![无敌连环 CallBack VS Promise 图](http://of2is3ok3.bkt.clouddn.com/xcx/images/promise.png)


### XpmJS 封装了常用后端操作，还提供一个管理后台，微信支付只要一行代码就可以实现！

![微信支付代码示例，管理后台截图](http://of2is3ok3.bkt.clouddn.com/xcx/images/paynow.png)


### 后端部署在你的云主机上！你可以完全掌控数据。


**方法1: 一键安装**

推荐使用[腾讯云一键安装链接](http://market.qcloud.com/products/1796)
（ 访问微信接口快, 可以免费申请 Https 证书 ） 


**方法2: 安装脚本**

安装前，先提前申请 Docker Hub 镜像
[申请地址 https://www.daocloud.io/mirror](https://www.daocloud.io/mirror)

```bash

# 支持Ubunbu 16.04 & 14.04 系统，推荐采用 Ubuntu 16.04 64位 LTS 
curl -sSL http://tuanduimao.com/xpmjs-server-1.5.2.sh | sh -s yourdomain.com http://<your id>.m.daocloud.io

```

**方法3: 使用 Docker 安装**

```bash

# 安装 Docker 
curl -sSL https://get.daocloud.io/docker | sh

# 启动容器
docker run -d --name=xpmjs-server  \
    -e "HOST=yourdomain.com" \
    -v /host/data:/data  \
    -v /host/apps:/apps  \
    -v /host/config:/config  \
    -p 80:80 -p 443:443  \
    hub.c.163.com/trheyi/xpmse:1.6.2

```


### XpmJS Server 升级 (1.0 ~ 1.5 需升级容器)

第一步: 下载代码: 

```bash
curl http://xpmjs-1252011659.costj.myqcloud.com/xpmjs-server-1.0.tar.gz

```

第二步: 解压并更新:

```bash
tar xvfz xpmjs-server-1.0.tar.gz
cd 1.0 && docker cp . xpmjs-server:/code

```


## 三、XpmJS 简明文档

### 1. 用户 ( User )

#### 用户登录 login()

```javascript
var user = app.xpm.require('User');

user.login().then( function( userInfo ) { 

    console.log( '用户登录成功', userInfo );
    app.session.set('loginUser', userInfo );
})

.catch( function( excp ) { 
    console.log('用户登录失败', excp );
});

```

#### 用户退出 logout()

```javascript
var user = app.xpm.require('User');

user.logout().then( function( userInfo ) { 
    console.log( '用户注销成功', userInfo );
})

.catch( function( excp ) { 
    console.log('用户注销失败', excp );
});

```

#### 读取资料 get()

来自微信客户端的用户信息 （ 非云端数据 ）

```javascript
var user = app.xpm.require('User');

user.get().then( function( userInfo ) { 
    console.log( '读取成功', userInfo );
})

.catch( function( excp ) { 
    console.log('读取失败', excp );
});

```


### 2. 信道（ Wss ）

使用 Websocket 信道，可以实现双向实时通信。

#### 打开信道 open()

```javascript
var wss = app.xpm.require('Wss');
wss.open('/wxapp').then(function( res ) {
    console.log( '信道连接成功', res );
})
.catch( function( excp ) { 
    console.log('信道连接失败', excp );
});
```

#### 在线用户 liveUsers ()

```javascript
var wss = app.xpm.require('Wss');
wss.liveUsers().then(function( users ) {
    console.log( '读取在线用户成功', users );
})
.catch( function( excp ) { 
    console.log('读取在线用户失败', excp );
});

```

用户信息数据结构

| 字段 | 中文 |说明 |
| :-: | :-: | :-: |
| id | 客户端ID | |
| _id | 用户ID |  |
| nickName | 微信昵称 | |
| gender | 性别 |  |
| avatarUrl | 头像| |
| language | 语言 | |
| group | 用户组 | |
| isadmin | 是否是管理员| 0 非管理员 1 管理员 |


#### 检查用户是否在线 isOnline ( xpmjs-server 1.0rc4+  )

```javascript

var user = app.xpm.require('User');
var wss = app.xpm.require('Wss');

user.login().then( function( userInfo ) { 
    return wss.isOnline( userInfo['_id'] )
    
}).then function( isOnline ) {
    if ( isOnline ) {
        console.log( '用户在线');
    } else {
        console.log( '用户离线');
    }
})
.catch( function( excp ) { 
    console.log('出错啦', excp );
});


```


#### 监听指令 listen()

小程序仅提供 WebSocket 客户端 API，所以小程序本身无法实现 WebSocket服务器。 wss.listen() 方法并非启动 WebSocket Server, 而是用来接收云端信道转发的指令。

```javascript
var wss = app.xpm.require('Wss');
wss.listen('payment', function( res, status ){
    // 当接收到 payment 指令后运行 
    if ( status != 'success') return ;
    console.log( res, status );
});
```


#### 发送指令 send()

```javascript

var wss = app.xpm.require('Wss');
wss.liveUsers().then(function( users ) {
    console.log( '读取在线用户成功', users );
    // 向第一个用户发送 payment 指令
    if ( users.length > 0 )  {
        return wss.send('payment', users[0], users[0]['id'] )
    } else {
        return {code:404, message:'no live user'};
    }
    
}).then( function( res ){
    console.log('发送完毕', res);
});
.catch( function( excp ) { 
    console.log('出错了', excp );
});

```

#### 绑定事件 bind()

接收并处理 websocket 服务器事件，有效值 ( open/close/message/error )

```javascript
var wss = app.xpm.require('Wss');
wss.bind('open', function(event) {
    console.log('信道服务器开启', event );
});

wss.bind('close', function(event) {
    console.log('信道服务器关闭', event );
});

```

### 3. 会话 ( Session )

Session 会话分为客户端和服务端两部分，客户端与服务端会话ID相同，客户端保存用户信息资料，服务端保存用户 openid 等敏感信息。与服务端通信，使用Sesssion ID 鉴权，通过服务器端验证后，请勿将 Session ID 发送给第三方。

#### 启用会话 start()

启用会话后，会自动创建一个会话ID

```javascript
var session = app.xpm.require('session');
    session.start();
```

#### 会话 ID id()

```javascript
var session = app.xpm.require('session');
var sid = app.id();
console.log( sid );

```


#### 客户端会话数据管理 set() & get()

```javascript
var session = app.xpm.require('session');
session.set('hello', 'world');
console.log( session.get('hello') );
```

### 4. 云端表格 ( Table )

可以使用云端表格接口，将数据保存在 MySQL 中，可以通过 SQL 查询数据。

#### 创建数据表 _schema()

仅管理员帐号拥有创建数据表权限 ( 登录管理后台，打开用户表，将开发者对应帐号记录的 isadmin 字段数值设置为 1 )

![配置管理员数值](http://of2is3ok3.bkt.clouddn.com/xpmjs/xpmjs/isadmin.png)


```javascript
var table = app.xpm.require('Table', 'hello');
table._schema(
    [  
      {name:"name", type:'string', option:{length:80, require:true }, acl:"rwd:r:-" },
      {name:"company", type:'string', option:{length:100}, acl:"w:-:-" }
    ], 
    { record:"rwd:rw:-", table:"rwd:-:-", field:'rwd:r:-',  user:'admin', group:'member' }
, true ).then( function( data ) {
    console.log('数据表创建成功', data );
})
.catch( function( excp ) { 
    console.log('数据表创建失败', excp );
});

```

字段配置参数

| 参数 | 中文 |说明 |
| :-: | :-: | :-: |
| name | 字段名称 | |
| type | 字段类型  | string/integer/text/boolean 等 |
| option | 字段参数  |  index:true 索引 unique:true 唯一索引 length:80 字段长度 |
| acl | 字段鉴权 | rw:rw:rw  r: 读取 w: 写入 -:无  user:group:other  |


#### 数据增删改查 get() create() update() remove()

```javascript
var table = app.xpm.require('Table', 'hello');

// 创建
table.create( 
    {name:'张艺谋', company:'中国电影制片厂'}
).then(function(data) { // 更新
    return table.update(data['_id'], {name:'冯小刚'});
    
}).then(function(data) { // 读取
    return table.get(data['_id']);
    
}).then(function(data) { // 删除
    return table.remove(data['name'], 'name' );
    
}).then(function(resp) {
    console.log( 'remove success', resp );
    
}).catch( function( excp ) { 
    console.log('出错了', excp );
});

```

#### 数据查询 query()

```javascript
var table = app.xpm.require('Table', 'hello');
table.query()
    .where('name', '=', '冯小刚')
    .orderby('name', 'asc')
    .limit(2)  // 仅查询 2条 

.fetch('name','company').then(function(data) {  
    console.log( '查询结果', data ); 
})


table.query()
    .where('name', '=', '冯小刚')
    .orderby('name', 'asc')
    .paginate(3, 2)  // 分3页，当前显示第 2页 

.fetch('name','company').then(function(data) {  
    console.log( '查询结果', data ); 
});
    
```

#### 联合查询 join(), leftjoin(), rightjoin() (xpmjs-server 1.0rc4+) 


Table 1: `User`

| id | name |title |
| :-: | :-: | :-: |
| 1   |  张三  | 产品经理 |
| 2   |  李四  | 工程师 |
| 3   |  王五  | 运维工程师 |

Table 2: `Project`

| id | name | uid |
| :-: | :-: | :-: |
| 1   |  小程序开发组 | 1 |
| 2   |  网页开发组  | 3 |

```javascript
var table = app.xpm.require('Table', 'Project');
table.query()
    .join('User', 'User.id', '=', 'Project.uid' )  // leftjoin / rightjoin
    .limit(1)  
.fetch('User.id as userid', 'User.name as username', 'Project.*').then(function(data) {  
    console.log( '查询结果', data ); 
})

```

返回值

```json
[
	{
		"id":1,
		"name":"小程序开发组"
		"userid":1,
		"username":"产品经理"
		
	}
]
```

#### inWhere 查询 inWhere()


Table 1: `User`

| id | name |title |
| :-: | :-: | :-: |
| 1   |  张三  | 产品经理 |
| 2   |  李四  | 工程师 |
| 3   |  王五  | 运维工程师 |

Table 2: `Project`

| id | name | users |
| :-: | :-: | :-: |
| 1   |  小程序开发组 | ["1","2","3"] |
| 2   |  网页开发组  |  ["1", "3"] |

```javascript
var table = app.xpm.require('Table', 'Project');
table.query()
    .inWhere('users', 'User', 'id', '*' )
    .limit(1)  
.fetch('User.id as userid', 'User.name as username', 'Project.*').then(function(data) {  
    console.log( '查询结果', data ); 
})

```

返回值

```json
[
	{
		"id":1,
		"name":"小程序开发组"
		"users":[
			{
				"id":1,
				"name":"张三",
				"title":"产品经理"
			}
			...
		]
		
	}
]
```

### 5. 微信支付 ( Pay )

#### 发起支付 request();

```javascript
var pay = app.xpm.require('Pay');
pay.request({
    total_fee:500,  // 单位分
    body:'算命、服务器开光',
    attach:'HELLO XpmJS.com', 
    detail:'{id:888,desp:"算命,抽SSR,赠送服务器开光"}'
}).then(function( data ){
    console.log('Request Pay Success', data );
}).catch( function( excp){
    console.log('Request Pay Failure', excp );
});

```

#### 云端事件 before(), success(), fail(), complete() (xpmjs-server 1.0rc4+)

```javascript
pay.before('create', {  // 创建充值记录 (统一下单成功后, 发起支付前, 在云端运行 )
	'table':'income',
	'data': {
		sn:'{{sn}}',
		order_sn: data.order.sn,
		uid:data.order.uid,
		amount:data.order.sale_price,
		amount_free:0,
		status:'PENDING',
		status_tips:"F请求付款"
	}
})

.order({   // 生成订单  ( 统一下单接口, 仅设定并不发送请求 )
    total_fee:data.order.sale_price,  // 单位分
    body:data.order.show_name,
    attach:'attach user is ' + mid,  // 应该是当前登录用户的 ID 
    detail:data
})

.success('update', { // 更新充值记录 （ 支付成功后回调，在云端运行 ）
	'table':'income',
	'data': {
		sn:'{{sn}}',
		status:'DONE',
		status_tips:"income status_tips field"
	},
	'unique':'sn'
})

.success('app', {   // 调用APP 示例 （ 支付成功后回调，在云端运行 ）
	'name':'xapp',
	'api':['ticket','index',{sn:'{{sn}}','status_tips':"{{0.status_tips}}"}],
	'data': {
		sn:'{{sn}}',
		status:'DONE'
	}
})

.success('update', {  // 更新订单状态 （ 支付成功后回调，在云端运行 ）
	'table':'order',
	'data': {
		_id:oid,
		status:'PENDING'
	}
})

.success('create', {   // 创建消费记录 （ 支付成功后回调，在云端运行 ）
	'table':'payout',
	'data': {
		sn:'{{sn}}',
		order_sn: data.order.sn,
		uid:data.order.uid,
		amount:data.order.sale_price,
		amount_free:0,
		status:'DONE',
		status_tips:"F请求付款"
	}
})

.request().then(function( payResp  ) {  // 发起请求
	console.log( payResp );
})
```


### 6. 本地存储 ( Stor ) 

```javascript
var stor = app.xpm.require('Stor');
stor.setSync('key','value');
console.log(stor.getSync('key'));

stor.setMapSync('map_name', 'key', 'value');
console.log(stor.getMapSync('map_name','key'));

```

### 7. 云端应用 ( App ) (xpmjs-server 1.0rc3+)

#### 调用示例

```javascript
var xapp = app.xpm.require('App', 'xapp' );  // xapp 应用名称

xapp.api( 'ticket', 'available' )  // ticket 控制器  available 方法名

.post({
    'train_date':'2017-01-26',
    'from_station':'BJP',
    'to_station':'SHH'
})

.then( function( resp ) {
  console.log('POST RESP:', resp );
})

.catch( function( excp ) {
  console.log('POST EXCP:', excp );
});

```

#### XpmJS 云端应用开发

参考云端应用 Demo [<火车票余票查询接口实现>](https://git.oschina.net/xpmjs/xapp)

https://git.oschina.net/xpmjs/xapp


![应用安装](http://of2is3ok3.bkt.clouddn.com/xpmjs/xpmjs/xappinstall.png)


### 8. 云端队列 ( Que.js ) (xpmjs-server 1.0rc4+)

```javascript
var que = app.xpm.require('Que', 'hello');
que.select('world').push('create', {  // 增加数据
	table:'payout',
	data: {
		sn:'200193',
		order_sn:'test29993',
		amount:100,
		status:'DONE'
	}
}).push('update', { // 更新数据
	table:'order',
	data: {
		sn:'148457330261256',
		status_tips:'{{0.sn}} {{0.status}}'
	},
	unique:'sn'
}).push('app', {   // 调用APP 示例
	'name':'xapp',
	'api':['ticket','index',{sn:'{{0.sn}}'}],
	'data': {
		sn:'{{0.sn}} {{1.sn}}',
		status:'DONE'
	}
}).run().then(function(resp){
	console.log( 'Response', resp );
})
.catch(function(excp){
	console.log( 'Error', excp );
})
```


### 9. 文件上传 Utils.upload  &  App.upload  (xpmjs-server 1.0+)

上传文件到腾讯云对象存储 
 
```javascript
var qcloud = app.xpm.require('app', 'xqcloud');
qcloud.api("cos",'upload')

.upload( tempFilePaths[0] )
.then(function(data){
	that.setData({
		'rs.corver':data.access_url,
		'rs.images':[data.access_url]
	});
})
.catch( function(excp){
	console.log('Upload Fail', excp );
});
```


### 10. 常用方法 (  Utils )

  
#### 请求网址 ( Utils.fetch ) (xpmjs-server 1.0rc3+)

```javascript
var utils = app.xpm.require('Utils' );  

utils.fetch( 'http://qcloud.com' ).then( function( resp ) {    
    console.log('FETCH RESP:', resp );
})

.catch( function( excp ) {
  console.log('FETCH EXCP:', excp );
});

```


#### 生成二维码图片 ( Utils.qrImageUrl ) (xpmjs-server 1.0+)

返回二维码图片地址

```javascript
var utils = app.xpm.require('Utils' ); 
var url = utils.qrImageUrl('hello world', {size:200});
console.log( url );
```


#### 生成小程序页面二维码  ( Utils.qrcode ) ( xpmjs-server 1.0 )

```javascript
var utils = app.xpm.require('Utils' ); 
var url = utils.qrcode('/page/detail?id=1');
console.log( url );

```



## 三、微信小程序 Demo

![微信小程序 Demo](http://of2is3ok3.bkt.clouddn.com/xpmjs/xpmjs/wechat.demo.png)

[小程序 Demo 源码](https://git.oschina.net/xpmjs/wxdemo)



## 四、安装配置

### 1. 云端配置

**【安装后端程序】**

推荐使用[腾讯云](http://market.qcloud.com/products/1796)（ 访问微信接口快, 可以免费申请 Https 证书 ） 

方法1: 使用脚本安装 （ **目前支持 Ubuntu 16.04/14.04 64 LTS 操作系统** ）

创建一台云服务器，选择 **Ubuntu 16.04/14.04 64 LTS** 操作系统。 登录服务器运行以下脚本。

安装前，先提前申请 Docker Hub 镜像
[申请地址 https://www.daocloud.io/mirror](https://www.daocloud.io/mirror)

```bash
curl -sSL http://tuanduimao.com/xpmjs-server.sh | sh -s yourdomain.com http://<your id>.m.daocloud.io

```

方法2: 使用 Docker 安装

```bash
docker run -d --name=xpmjs-server  \
    -e "HOST=yourdomain.com" \
    -v /host/data:/data  \
    -v /host/apps:/apps  \
    -v /host/config:/config  \
    -p 80:80 -p 443:443  \
    tuanduimao/xpmjs-server:1.0
        
```

**【设置管理员名称和密码】**

访问: http://yourdomian.com/setup.php

1. 填写后台信息
![setup-1.png](http://of2is3ok3.bkt.clouddn.com/xpmjs/xpmjs/setup-1.png)

2. 填写管理员信息
![setup-2.png](http://of2is3ok3.bkt.clouddn.com/xpmjs/xpmjs/setup-2.png)


**【上传 HTTPS 证书 & 微信支付证书】**

访问：http://yourdomian.com/_a/baas-admin/cert/index
上传 HTTPS 证书和证书密钥； 如已申请微信支付，建议尽量上传支付证书，用于双向验证证书和密钥，确保支付安全。

![https-cert.png](http://of2is3ok3.bkt.clouddn.com/xpmjs/xpmjs/https-cert.png)

上传好证书后，登录服务器，重启容器。

```bash
docker restart xpmjs-server
```

访问： https://yourdomian.com  ( 有 **"S"**， 检查证书是否生效 ）


**【设置小程序配置信息】**

访问： https://yourdomian.com/_a/baas-admin/conf/index ( 有 **"S"**， 填写小程序和微信支付的信息 ）

![wechat-conf](http://of2is3ok3.bkt.clouddn.com/xpmjs/xpmjs/wechat-conf.png)



### 2. 使用 XpmJS 

**【下载代码】**

使用  Git Bash , 进入小程序项目目录， 运行 git clone 拉去代码。（也可以
使用 Git 等客户端 Clone 代码 ）

```bash
git clone https://git.oschina.net/xpmjs/xpmjs.git xpmjs

```

克隆成功后的目录结构为: 

![tree](http://of2is3ok3.bkt.clouddn.com/xpmjs/xpmjs/tree.png)


**【编写配置信息】**

编辑 `app.js` 将域名更换为你的域名。（ 必须配置好 Https 证书 ）

```javascript
App({

  onLaunch: function () {

    var that = this;

    // 创建 xpm 对象
    this.xpm = require('xpmjs/xpm.js').option({
        'app':1,  // 对应后台 APP 配置，支持5个
        'host':'yourdomian.com',
        'https':'yourdomian.com',
        'wss': 'yourdomian.com/ws-server',
        'table.prefix': 'demo',
        'user.table':'user'
    });

    // 创建全局对象
    this.wss = this.xpm.require('wss');  // 信道
    this.session = this.xpm.require('session');  // 会话
    this.stor = this.xpm.require('stor'); // 存储

  },

  xpm:null,
  session:null,
  stor:null,
  wss:null
})

```

建议将 xpm、wss、session、stor 设定为全局变量。更多示例参考 [小程序Demo](https://git.oschina.net/xpmjs/wxdemo)


## 五、XpmJS 交流群

XpmJS 小程序开发微信交流群

![小程序开发交流群三](http://of2is3ok3.bkt.clouddn.com/xqun3.png)


## 六、F.A.Q.

待整理

