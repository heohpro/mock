var express = require('express');
var	http = require('http');
var fs = require('fs');
var app = express();
var obj = {"hello":"world"};

app.get('/index.html/:id(\\d+)',function(req,res,next){
	if(req.params.id>10)
		next();
	else
		res.send('sorry');

});
app.get('/index.html/:id(\\d+)',function(req,res){
	res.send(obj);
});

app.get('/hello.html',function(req,res){
    res.send(obj);
});

app.listen(1337,"127.0.0.1");

/**
 * 将相对路径转化为绝对路径
 * @param path 相对路径
 * @returns {*} 相对于计算机根目录的绝对路径
 */
//var realpath = function(path){
//    if(!path){
//        return;
//    }
//    var root = __dirname;
//    if(path[0] === '/'){
//        return path;
//    }else if(path[0] === '.' && path[1] !== '.'){
//        return root+path.substring(1);
//    }else if(path[0] === '.' && path[1]==='.'){
//        pos = root.lastIndexOf('/');
//        return root.substring(0,pos)+path.substring(2);
//    }else{
//        return root+'/'+path;
//    }
//}

//var makedir = function(sPath){
//    var list = [];
//    var path = realpath(sPath);
//    if (path) {
//        var stat = fs.statSync(path);
//        if (stat.isDirectory()){
//            var
//        }
//    }
//}



var FILE_REG = /\.json$/; // 需要匹配文件的正则表达式，这里匹配.tpl.html结尾的文件
var PATH = 'api'; 	 // 读取的目录
var DEFINE_NAME = 'tpl/templates'; // 定义的模块名称
var TEMPLATES_FILE = 'app/tpl/templates.js'; // 输出文件路径

/**
 * 读取指定路径目录
 * @param sPath 目录路径
 * @returns {Array} 符合条件的文件路径的集合如[{store:"content"}]
 */
var readdir = function(sPath) {
    var list = [];
    var path = realpath(sPath);
    if (path) {
        var stat = fs.statSync(path);
        if (stat.isDirectory()) {
            var paths = fs.readdirSync(path)
            paths.forEach(function(each) {
                var subpath = sPath + '/' + each;
                list = list.concat(readdir(subpath));

            });
        } else if (stat.isFile() && FILE_REG.test(path)) {
                var data = fs.readFileSync(realpath(sPath),'utf8');
                var obj = {};
                obj[sPath] = data;
	            list.push(obj);
        }
    } else {
        console.error('unable to find [' + sPath + ']: No such file or directory.')
    }
    return list;
}
/**
 * 将相对路径转化为绝对路径
 * @param path 相对路径
 * @returns {*} 相对于计算机根目录的绝对路径
 */
var realpath = function(path){
	if(!path){
        return;
    }
    var root = __dirname;
    if(path[0] === '/'){
        return path;
    }else if(path[0] === '.' && path[1] !== '.'){
        return root+path.substring(1);
    }else if(path[0] === '.' && path[1]==='.'){
        pos = root.lastIndexOf('/');
        return root.substring(0,pos)+path.substring(2);
    }else{
    	return root+'/'+path;
    }
}
///**
// * 将指定路径下的文件格式化成对象 如store.tpl.html 格式化为 {store:"文件内容"}
// * @param path 文件路径
// * @returns {{}} 文件对象
// */
//var formatFile = function(path) {
//    var content = false,subpath = path.substring(path.lastIndexOf('/')+1),tpl_name,obj = {};
//    if (fs.existsSync(path)) {
//        content = fs.readFileSync(path).toString();
//    } else {
//        console.error('unable to read file[' + path + ']: No such file or directory.');
//    }
//    tpl_name = subpath.substring(0,subpath.indexOf('.'));
//    obj[tpl_name] = content;
//    obj[tpl_name] = obj[tpl_name].replace(/\n(\s+)?/ig,'');
//    return obj;
//};
var router = function(){
	/**
	 *  将文件集合转化为字符串
	 */
	var list = readdir(PATH);
    list.forEach(function(each){
        for(attr in each){
            var data = each[attr];
            app.get('/'+attr,function(req,res){
                res.send(data);
            })
        }
    })



    //
    //list.forEach(function(file,index,arr){
	//	var temp = JSON.stringify(file);
	//	templates.push(temp.substring(1,temp.length-1))
	//});
	//var result = 'define("'+DEFINE_NAME+'",[],function(){\n    var templates = {\n        ';

    //console.log(templates.length);
    //console.log(typeof templates[1]);

    //templates.forEach(function(tpl,index){
	//	if(index === templates.length-1){
	//		result += tpl+'\n';
	//	}else{
	//		result += tpl+',\n        ';
	//	}
	//});
	//result += '    };\n    return templates;\n});';
	///**
	// * 输出
	// */
	//fs.writeFile(TEMPLATES_FILE,result,function(err){
	//	if(err){
	//		console.log(err);
	//	}
	//});
}
router();
//  监视文件变化
//fs.watch(PATH,function(event,filename){
//	if(FILE_REG.test(filename)){
//		console.log('文件'+filename+'已更新');
//		output_templates();
//	}
//})
