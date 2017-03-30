var xpmOptions = require('config.js');

App({

  onLaunch: function () {

    console.log( xpmOptions );
    
    var that = this;

    // 创建 xpm 对象
    this.xpm = require('xpmjs/xpm.js').option(xpmOptions);
    
    // 创建全局对象
    this.wss = this.xpm.require('wss');  // 信道
    this.session = this.xpm.require('session');  // 会话
    this.stor = this.xpm.require('stor'); // 存储
    this.utils = this.xpm.require('utils'); // 工具
    this.user = this.xpm.require('user'); // 工具
    
    this.stor.clearSync();

    
  },
  xpm:null,
  utils:null,
  session:null,
  stor:null,
  wss:null
})