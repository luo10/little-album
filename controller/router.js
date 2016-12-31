// 引入models
var file = require('../models/file.js');
var fs = require('fs');
var sd = require('silly-datetime');
var path = require('path');
// 引入formidable
var formidable = require('formidable');
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

// 相册页
exports.showAlbum = function(req, res, next) {
    // 从url上拿到albumName字段
    var albumName = req.params.albumName;
    // 交给models处理拿到images名字列表
    file.getAllImagesByAlbumName(albumName, function(err, imagesArray) {
        if (err) {
            // 如果没有交给下一个中间件
            next();
            return;
        }
        // 渲染album模板
        res.render('album', {
            'albumname': albumName,
            'images': imagesArray
        });
    });
}

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

// 上传表单
exports.doPost = function(req, res, next) {
    // 使用 formidable 处理form 提交表单
    var form = new formidable.IncomingForm();

    // 设置临时文件上传路径
    form.uploadDir = path.normalize(__dirname + '/../tempup');
    // 解析请求中的表单数据
    form.parse(req, function(err, fields, files, next) {
        // console.log(fields);
        // console.log(files);
        if (err) {
            // 抛给下一个
            next();
            return;
        }
        // 尺寸过大删除
        // tupian 是html里面name设置的
        var size = parseInt(files.tupian.size);
        console.log(size);
        if (size < 20000) {
            res.send('图片尺寸应该小于1M');
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
