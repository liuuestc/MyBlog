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
//发现最火文章
exports.findHot = function (subject) {

};
