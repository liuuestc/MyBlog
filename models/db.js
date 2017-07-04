/**
 * Created by liuuestc on 17-7-4.
 */
//数据库状态记录
var dbUtil = require("../routes/DBUtil")

var mongoose = require('mongoose');
var dbURI = 'mongodb://'+returenUserandPassString()+'localhost/PersionalBlog';
mongoose.connect(dbURI);
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});
//进程结束时关闭与数据库的链接
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

function returenUserandPassString() {
    var obj1 = dbUtil.getUserAndPass(0);
    return obj1.user+":"+obj1.pass+"@";
}