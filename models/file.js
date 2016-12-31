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
