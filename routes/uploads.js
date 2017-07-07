//测试文件，不正式使用
var db1 = require('../models/user'),
    db2 = require('../models/uploadFile'),
    mongoose = require('mongoose'),
    Upload = mongoose.model('Upload'),
    FileCmt = mongoose.model('FileCmt'),
    User = mongoose.model('User');
var express = require('express');
var router = express.Router();
var fs =require('fs'),
    path = require('path'),
    formidable = require('formidable');
var dbUtil = require('./DBUtil');
/* GET home page. */

router.get('/', function(req, res) {
    res.render('upload', { title: '' });
});
router.get('/download', function(req, res) {
    res.download('../upload/','2.pdf');
});
router.get('/upload',function (req,res) {
    res.render('upload',{title: ''})
});
router.get('/uploaded',function (req,res) {
    res.render('upload',{title: '上传成功，继续上传文件'})
});
router.get('/failupload',function(req,res){
    res.render('upload',{title:'用户名和密码不符'});
});

router.get('/nofile', function (req, res) {
    res.render('upload',{title : '没有选择文件'}) ;
});

router.post('/upload',function (req,res) {
    //判断上传是否合法，检查学号和姓名
    //如果合法，则改变上传的状态

    //存储上传的文件
    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';		//设置编辑
        form.uploadDir = 'upload/'; 	 //设置上传目录
        form.keepExtensions = true;	 //保留后缀
        form.maxFieldsSize = 3 * 1024 * 1024;   //文件大小
        //这里formidable会对upload的对象进行解析和处理
        form.parse(req, function(err, fields, files) {
            var filename  =files.upload.name+'->>'+ new Date()
            var newPath = form.uploadDir+ filename;
            User.findOne({
                    name: fields.name,
                    password: fields.password
                },
                function (err, user) {
                    if(!user){
                        res.redirect('/upload/failupload')
                    }
                    else {
                        if(files.upload.name == ''){
                            fs.unlink(files.upload.path);
                            res.redirect('/upload/nofile');
                        }
                        else {
                            Upload.create({
                                name : fields.name,
                                fileName: filename
                            },function (err, file) {
                                if(!err){
                                    fs.renameSync(files.upload.path,newPath);
                                    res.redirect('/');
                                }
                            })
                        }
                    }
                });
        });
    }
});


//获取文件列表,实验时使用
router.get('/list', function(req, res, next) {
    fs.readdir("/var/workPlace/wwWorkplace/shiyanshiupload/syssystem/upload", function (err, files) {
        if(err) {
            console.error(err);
            return;
        } else {
            files.forEach(function (file) {
                var filePath = path.normalize('/var/workPlace/wwWorkplace/shiyanshiupload/syssystem/upload/' + file);
                //console.log(filePath);
                fs.stat(filePath, function (err, stat) {
                    if(stat.isFile()) {
                        // console.log(filePath + ' is: ' + 'file');
                    }
                    if(stat.isDirectory()) {
                        console.log(filePath + ' is: ' + 'dir');
                    }
                });
            });
        }
        res.render('document',{doucuments:files});
    });
});
//下载文件
router.get('/getdoc/:name',function (req,res) {
    var doc_path = 'upload/'+req.params['name'],
        filename = req.params['name'].split('->>')[0];
   res.download(doc_path,filename,function (err) {
       if(err){
           res.render('error');
       }
   });
});

//返回文件的页面
router.get('/getdocProfile/:name', function (req,res) {
    var title = req.params['name'];
    if(title != ''){
        Upload.find(
            {fileName: title},
            function (err,subject) {
                if(!err && subject){
                    var aftertitle = dbUtil.fileInfo(subject[0]);
                    FileCmt.find({
                        fileName : title
                        },
                        '_id name createOn content',
                        {sort: {'_id' : -1}},
                        function (err, comments) {
                        if(err){
                            res.render('files',{title: aftertitle, filename: req.params['name'], comment:''});
                        }
                        else {
                            if(!comments){
                                res.render('files',{title: aftertitle, filename: req.params['name'], comment:''});
                            }
                            else {
                                var clength = comments.length;
                                var cms ='';
                                for(var i=0;i < clength; i++){
                                    cms += dbUtil.addcomment(comments[i]['content'],comments[i]['name'],comments[i]['createOn']);
                                }
                                res.render('files',{title: aftertitle, filename: req.params['name'], comment:cms});
                            }
                        }
                    });
                }
                else {
                    res.render('files',{title: 'no file', filename: req.params['name']});
                }
            }
        )
    }
});

router.post('/doc/comment/:filename',function (req,res) {
    var filename = req.params['filename'];
    User.findOne({
        name: req.body.cmtname,
        password: req.body.cmtpassword
    },function (err, user) {
        if(err) res.json({'status':'no'});
        if (user){
           FileCmt.create({
               fileName : filename,
               name : req.body.cmtname,
               content: req.body.message
           },function (err, comment) {
               if (!err){
                   res.json({'status':'ok'});
               }
           });
       }
       else res.json({'status':'no'});
    });


});

router.use('/uploadpage',function (req,res) {
    res.render('upload',{'title': "文件上传"});
});


module.exports = router;