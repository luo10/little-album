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
