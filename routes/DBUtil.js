/**
 * Created by liuuestc on 16-11-5.
 */

exports.getUserAndPass=function (){
    var fs = require('fs');
    var data = fs.readFileSync("Config",'utf8').split("\n");
    return data;
};


function findHot(subject) {

}
