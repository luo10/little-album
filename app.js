// 引入express框架
var express = require('express');
// 注册express
var app = express();
// 引入控制器
var router = require('./controller');
// 设置模板引擎ejs
app.set('view engine', 'ejs');
// 设置静态资源路径
app.use(express.static('./public'));
// 让存图片的文件夹也能访问
app.use(express.static('./uploads'));

// 设置路由
// --首页
app.get('/', router.showIndex);
// --首页点击相册内页
app.get('/:albumName', router.showAlbum);
// --上传页面路由,接收页
app.get('/up', router.showUp);
// --接收上传文件
app.post('/up', router.doPost);
// 监听端口
app.listen(3004, function() {
    console.log("启动3004端口成功");
});
