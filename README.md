XpmJS - 小程序云端增强 SDK 
================

## 一、XpmJS 能做啥

XpmJS 为微信小程序提供云端能力。无需编写后端代码，即可实现用户登录、WebSocket 通信、微信支付、云端数据表格、文件存储等功能。虽然 PHP 是最好的编程语言, 但是使用 XpmJS 后, 无需学习包括 PHP 在内的任何后端语言，**用 Javascript 即可搞定一切，NodeJS 也不用！**


## 二、XpmJS 咋用

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

仅管理员帐号可以运行

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

#### 6. 本地存储 ( Stor ) 

```javascript
var stor = app.xpm.require('Stor');
stor.setSync('key','value');
console.log(stor.getSync('key'));

stor.setMapSync('map_name', 'key', 'value');
console.log(stor.getMapSync('map_name','key'));

```


## 三、微信小程序 Demo

![微信小程序 Demo](http://7xleg1.com1.z0.glb.clouddn.com/demo-sc)


扫描二维码体验

![微信小程序 Demo](http://7xleg1.com1.z0.glb.clouddn.com/wxapp-0.93.jpg)


如无权限，扫码申请

![微信小程序 Demo](http://7xleg1.com1.z0.glb.clouddn.com/qrcode)



## 四、安装配置

### 1. 申请 Https 证书

### 2. 云端程序安装配置

### 3. 启用 SDK 


## 五、未来规划

## 六、参与贡献






