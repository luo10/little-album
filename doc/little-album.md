[代码地址哦](https://github.com/luo10/little-album)

# 首页

## 目录结构
- controller ——控制器层
- models ——数据层
- node_modules ——依赖包文件
- public ——静态文件目录
- uploads ——上传文件保存目录
- tempup ——临时缓存文件
- views ——显示层
- app.js ——住文件入口
- package.json ——配置文件

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
    "formidable": "^1.0.17",
    "silly-datetime": "^0.1.2"
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
                if (stats.isDirectory()) {
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
                    allImages.push(files[i]);
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

# 相册内页

## 1.添加路由

##### app.js

```
// --首页点击相册内页
app.get('/:albumName',router.showAlbum);
```

## 2.controller层添加控制器

##### controller/router

```
// 相册页
exports.showAlbum = function(req, res, next) {
    // 从url上拿到albumName字段
    var albumName = req.params.albumName;
    // 交给models处理拿到images名字列表
    file.getAllImagesByAlbumName(albumName, function(err, imagesArray) {
        if (err) {
            next();
            return;
        }
        // 渲染album模板
        res.render('album', {
            'albumname' : albumName,
            'images' : imagesArray
        });
    });
}
```

## 3.view层添加模板

##### views/album.ejs

```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>小小相册</title>
    <link href="/css/bootstrap.min.css" rel="stylesheet">
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
                <li><a href="/">全部相册<span class="sr-only">(current)</span></a></li>
                <li><a href="/up">上传</a></li>
            </ul>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>

    <div class="container">
        <ol class="breadcrumb">
            <li><a href="/">全部相册</a></li>
            <li class="active"><%=albumname%></li>
        </ol>

        <div class="row">
            <% for(var i = 0 ; i < images.length ; i++){ %>
                <div class="col-xs-6 col-md-3">
                    <a href="#" class="thumbnail">
                        <img src="<%=images[i]%>" alt="...">
                    </a>
                    <h4> </h4>
                </div>
            <%}%>
        </div>
    </div>

    <script src="/js/jquery-1.11.3.min.js"></script>
    <script src="/js/bootstrap.min.js"></script>
</body>
</html>
```

## 4.把uploads内加入静态资源

##### app.js

```
// 让存图片的文件夹也能访问
app.use(express.static('./uploads'));
```

==node app.js跑一下看下吧==

# 上传页

## 1.路由

##### app.js

```
// --上传页面路由,接收页
app.get('/up', router.showUp);
```

## 2.controller添加控制器

##### controller/router.js

```
// 上传接收页
exports.showUp = function(req, res, next) {
    // 获取所有文件夹名称
    file.getAllAlbums(function(err, albums) {
        // 渲染up页面
        res.render('up', {
            albums: albums
        });
    });
}
```

## 3.view层添加模板

这里循环拿到的文件夹名称数组albums

form提交  enctype="multipart/form-data"  要改成这个

##### views/up.ejs

```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>小小相册</title>
    <link href="/css/bootstrap.min.css" rel="stylesheet">
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
                <li><a href="#">全部相册<span class="sr-only">(current)</span></a></li>
                <li><a href="#">上传</a></li>
            </ul>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>

    <div class="container">
        <div class="row">
        <!-- form 必须改为multipart/form-data 才能拿到文件 -->
            <form style="width:40%;" method="post" action="#" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="exampleInputEmail1">选择文件夹</label>
                    <!-- 循环拿到的albums文件夹名数组 -->
                    <select class="form-control" name="wenjianjia">
                        <% for(var i = 0 ; i < albums.length ; i++){%>
                            <option><%= albums[i] %></option>
                        <%}%>
                    </select>
                 </div>

                <div class="form-group">
                    <label for="exampleInputFile">选择图片</label>
                    <p>尺寸小于2M</p>
                    <input type="file" id="exampleInputFile"  name="tupian">
                 </div>

                <button type="submit" class="btn btn-default">上传</button>
            </form>
        </div>
    </div>

    <script src="/js/jquery-1.11.3.min.js"></script>
    <script src="/js/bootstrap.min.js"></script>
</body>
</html>
```

ok啦 访问 /up 看下吧 ~

# 接收上传文件

## 1.路由

##### app.js

```
// --接收上传文件
app.post('/up', router.doPost);
```

## 2.controller层

向router里面添加方法

##### controller/router.js

```
var fs = require('fs');
var sd = require('silly-datetime');
var path = require('path');

// 上传表单
exports.doPost = function(req, res, next) {
    // 使用 formidable 处理form 提交表单
    var form = new formidable.IncomingForm();

    // 设置临时文件上传路径
    form.uploadDir = path.normalize(__dirname + '/../tempup');
    // 解析请求中的表单数据
    form.parse(req, function(err, fields, files, next) {
        console.log(fields);
        console.log(files);
        if (err) {
            // 抛给下一个
            next();
            return;
        }
        // 尺寸过大删除
        // tupian 是html里面name设置的
        var size = parseInt(files.tupian.size);
        if (size > 2000) {
            res.send('图片尺寸应该小鱼1M');
            // 删除缓存图片 这里要用到fs模块
            fs.unlink(files.tupian.path);
            return;
        }
        // 接下来改名字
        // 获取时间戳
        var ttt = sd.format(new Date(), 'YYYYMMDDHHmmss');
        // 获取随机数
        var ran = parseInt(Math.random() * 89999 + 10000);
        // 获取上传的文件名
        var extname = path.extname(files.tupian.name);
        // 获取文件夹名字
        var wenjianjia = fields.wenjianjia;
        // 缓存的文件路劲
        var oldpath = files.tupian.path;
        // 存下来的路径
        var newpath = path.normalize(__dirname + '/../uploads/' + wenjianjia + '/' + ttt + ran + extname);
        // 改名字
        fs.rename(oldpath, newpath, function(err) {
            if (err) {
                res.send('改名失败');
                return;
            }
            res.send('成功')
        });
    });
    return;
}
```

==运行下上传个图片看看效果吧==




