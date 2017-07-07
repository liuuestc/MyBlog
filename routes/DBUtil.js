/**
 * Created by liuuestc on 16-11-5.
 */

exports.getUserAndPass=function (i){
    var fs = require('fs');
    var data = fs.readFileSync("config",'utf8').split("\n");
    return {user: data[2*i].split(',')[0],pass:data[2*i+1]};
};
//防止url注入
exports.processURL = function () {

};

//防止文本框注入
exports.AntiSqlValid = function (oField ) {
    re = /select|update|delete|exec|count|'|"|=|;|>|<|%/i;
    if (re.test(oField.value)) {
        //alert("请您不要在参数中输入特殊字符和SQL关键字！"); //注意中文乱码
        oField.value = '';
        oField.className = "errInfo";
        oField.focus();
        return false;
    }
};

//将最新文章抽取的数据转换成html
exports.hotToTitle=function(subject,i) {
    var title = "<div class='list-group-item' id='getBlog"+ i+ "'><h4 class=" + "list-group-item-heading> <a onclick='return false;' href='/articles/article/"+subject['_id']+"'> "+ subject['title']+"</a></h4>" +
        "<p class='list-group-item-text' style='margin-top: 5px;margin-bottom: 0px'><small>阅读量：" + subject['readNum'] +
        " 日期： " + subject['createdOn'] +
        "标签：" + subject['tags']+ "</small></p></div> ";
    return title;
};


//数据库插入最新文章函数,
exports.findHot=function(subject) {
    Poster.find(
        {subject: subject},
        {},
        {sort: {readNum :-1, _id: -1}},
        function (err, data) {
            if(!err){
                if(data != ''){
                    HotPost.create({
                        id: data[0]['_id'],
                        subject: data[0]['subject'],  //文章的类别
                        tags: data[0]['tags'],     //文章系类
                        title:  data[0]['title'],   //文章的标题
                        author:data[0]['author'],    //作者
                        readNum: data[0]['readNum'], //文章的阅读量
                        createdOn: dbUtil.processDateString(data[0]['createdOn'] )//创建时间
                    },function (err, hotPost) {
                        if (!err){
                            console.log('查找完毕！')
                        }
                        if (!hotPost)
                            return null
                    });

                }
            }
            else{
                console.log('获取数据失败！');
                return null;
            }
        }
    )
};

exports.processDateString=function(date) {
    var dt = new Date(date.toString());
    return dt.getFullYear() + '-' + dt.getMonth() + '-' + dt.getDate() +
        '  ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
};

exports.fileInfo=function(subject) {
    var dt = new Date(subject['createdOn']);
    var i=0;  //没用
    var filename = subject['fileName'].split('->>')[0];
    var title = "<div class='list-group-item' id='getBlog"+ i+ "'><h4 class=" + "list-group-item-heading> <a href='/upload/getdoc/"+subject['fileName']+"'> "+ filename+"</a></h4>" +
        "<p class='list-group-item-text' style='margin-top: 5px;margin-bottom: 0px'><small>"+
        " 日期： " + dt.getFullYear() +"-"+ dt.getMonth() +"-" + dt.getDate()+
        '  ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() +
        "  by：" + subject['name']+ "</small></p></div> ";
    return title;
};

exports.addcomment =function(message,name,date) {
    var dt = new Date(date);
    var time =  dt.getFullYear() + '-' + dt.getMonth() + '-' + dt.getDate() +
        '  ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
    var text = " <div class='row' style='text-align: left'><div class='col-md-12'> <blockquote> <p>" +
        message +
        "</p> <small>"+ time + " by:"+" <cite>"+ name+"</cite></small> </blockquote></div></div>";
    return text;
};



exports.ihotToTitle=function(subject,i) {
    var title = "<div id='getBlog"+ i+ "'><a onclick='return false;' href='/articles/article/"+subject['id']+"'> "+ subject['title']+"</a></div> " +
        "<p style='margin-top: 5px;margin-bottom: 0px'><small>阅读量：" + subject['readNum'] +
        " 日期： " + subject['createdOn'] +
        "标签：" + subject['tags']+ "</small></p>";
    return title;
};

//与上面的代码相同，修改为使用js返回的代码
exports.itoTitle=function (subject,i) {
    var dt = new Date(subject['createdOn']);
    var title = "<div class='list-group-item' id='getBlog"+ i+ "'><h4 class=" + "list-group-item-heading> <a onclick='return false;' href='/upload/getdocProfile/"+subject['fileName']+"'> "+ subject['fileName'].split('->>')[0]+"</a></h4>" +
        "<p class='list-group-item-text' style='margin-top: 5px;margin-bottom: 0px'><small>"+
        " 日期： " + dt.getFullYear() +"-"+ dt.getMonth() +"-" + dt.getDate()+
        '  ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() +
        "  by：" + subject['name']+ "</small></p></div> ";
    return title;
};

//正式使用的代码
function ifileInfo(subject,i) {
    var dt = new Date(subject['createdOn']);
    var title = "<div class='list-group-item' id='getBlog"+ i+ "'><h4 class=" + "list-group-item-heading> <a href='/upload/getdoc/"+subject['fileName']+"'> "+ subject['fileName'].split('->>')[0]+"</a></h4>" +
        "<p class='list-group-item-text' style='margin-top: 5px;margin-bottom: 0px'><small>"+
        " 日期： " + dt.getFullYear() +"-"+ dt.getMonth() +"-" + dt.getDate()+
        "          作者：" + subject['name']+ "</small></p></div> ";
    return title;
};
