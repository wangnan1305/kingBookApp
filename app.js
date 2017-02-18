/**
*	web服务测试
*/

var koa = require("koa");
var path = require("path");
var static_cache = require("koa-static-cache");//静态文件缓存
var app = koa();

//静态文件缓存
app.use(static_cache(path.join(__dirname,"src")));

//启动服务
console.log("启动web服务，监听端口5000");
app.listen(5000);