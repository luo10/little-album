// 引入express框架
var express = require('express');
// 注册express
var app = express();
// 引入控制器
var router = require('./controller');
// 设置模板引擎ejs
app.set('view engine', 'ejs');
// 设置静态资源路径
app.use(express.static("./public"));

// 设置路由
// --首页
app.get('/', router.showIndex);
// 监听端口
app.listen(3004, function() {
    console.log("启动3004端口成功");
});
