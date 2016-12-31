## 目录结构
- controller ——控制器层
- models ——数据层
- node_modules ——依赖包文件
- public ——静态文件目录
- uploads ——上传文件保存目录
- views ——显示层
- app.js ——住文件入口
- package.json ——配置文件

# 首页

## 1.第一步
新建package.json文件，并执行npm install 安装依赖包文件，然后新建各个文件夹。

```
{
  "name": "little-album",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "dependencies": {
    "ejs": "^2.3.4",
    "express": "^4.13.3",
    "formidable": "^1.0.17"
  },
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

## 2.启动express模块
写入app.js，并且node app.js启动看看

```
// 引入express框架
var express = require('express');
// 注册express
var app = express();
// 设置模板引擎ejs
app.set('view engine', 'ejs');

// 设置静态资源路径
app.use(express.static("./public"));

// 监听端口
app.listen(3004, function() {
    console.log("启动3004端口成功");
});

```

## 3.设置首页路由
向app.js里面添加

```
// 引入控制器
var router = require('./controller');

// 设置路由
// --首页
app.get('/', router.showIndex);
```
router.showIndex是渲染控制器方法

## 4.添加控制器
向controller文件夹下添加router.js文件，且设置配置文件，package.json 设置默认入口为router.js否则默认index.js

##### package.json

```
{
    "main": "router.js"
}
```

##### router.js

```
// 设置首页模板渲染方法
exports.showIndex = function(req,res,next) {

}
```

这里需要去文件夹拿照片 所以去models文件夹下新增file.js

## 5.设置models层
新建file.js，写入查找文件的遍历方法

```
// 引入fs模块
var fs = require('fs');

// callback(err,date);
// 找到uploads下所有文件夹
exports.getAllAlbums = function(callback) {
    // 读取文件夹内所有文件夹名字
    fs.readdir('./uploads', function(err, files) {
        // 设置报错
        if (err) {
            callback('没有找到uploads文件', null);
        }
        // 接收文件夹
        var allAlbums = [];
        // 自执行遍历查询所有文件
        (function iterator(i) {
            // 如果最后一个遍历结束
            if (i == files.length) {
                // 输出接收的文件名
                console.log(allAlbums);
                // 回调输出
                callback(null, allAlbums);
                return;
            }
            // 输出文件夹名字
            fs.stat('./uploads/' + files[i], function(err, stats) {
                // 报错
                if (err) {
                    callback('找不到文件' + files[i], null);
                }
                // 是文件夹就加入数组
                if (starts.isDirectory()) {
                    allAlbums.push(files[i]);
                }
                // 下一条遍历
                iterator(i + 1);
            });
        })(0);
    });
}

// 通过文件夹名，得到所有图片
exports.getAllImagesByAlbumName = function(albumName, callback) {
    // 查找指定文件夹下的所有文件
    fs.readdir('./uploads/' + albumName, function(err, files) {
        // 报错
        if (err) {
            callback('没有找到uploads文件', null);
            return;
        }
        // 接收文件名
        var allImages = [];
        // 遍历指定文件夹下的所有图片
        (function iterator(i) {
            if (i == files.length) {
                console.log(allImages);
                callback(null, allImages);
                return;
            }
            //
            fs.stat('./uploads/' + albumName + '/' + files[i], function(err, stats) {
                // 报错
                if (err) {
                    callback('找不到文件' + files[i], null);
                }
                // 加入数组
                if (stats.isFile()) {
                    allImage.push(files[i]);
                }
                // 下一次遍历
                iterator(i + 1);
            });
        })(0);
    });
}

```

## 6.router中引用models
修改router文件，
##### controller/router.js

```
// 引入models
var file = require('../models/file.js');
// 设置首页模板渲染方法
exports.showIndex = function(req, res, next) {
    // 找到upload下面所有文件夹名
    file.getAllAlbums(function(err, allAlabums) {
        if (err) {
            // 交给下面的中间件
            next();
            return;
        }
        // 渲染模板，引用views里index模板
        res.render('index', {
            'albums': allAlabums
        });
    });
}
```

并且在views文件夹下新增index.ejs文件

```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>小小相册</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <style type="text/css">
        .row h4{
            text-align: center;
        }
    </style>
</head>
<body>
<nav class="navbar navbar-default">
    <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">小小相册</a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
                <li class="active"><a href="/">全部相册<span class="sr-only">(current)</span></a></li>
                <li><a href="/up">上传</a></li>
            </ul>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>

    <div class="container">
        <div class="row">
            <% for(var i = 0 ; i < albums.length ; i++){ %>
                <div class="col-xs-6 col-md-3">
                    <a href="<%= albums[i] %>" class="thumbnail">
                        <img src="images/wjj.jpg" alt="...">
                    </a>
                    <h4><%= albums[i] %></h4>
                </div>
            <% } %>
        </div>
    </div>

    <script src="js/jquery-1.11.3.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
</body>
</html>
```

在public文件夹下加入images文件夹且引入wjj.jpg图片文件

==在uploads下面新建几个文件夹 node app.js 运行看一下效果吧==