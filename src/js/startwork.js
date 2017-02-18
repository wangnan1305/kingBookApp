/**
*	开始工作
*/

$(function(){
	//实例化
	var appView = new window.ebookweb.views.AppView({model:new window.ebookweb.models.AppModel()});//主应用
	var router = new window.ebookweb.Router();//路由

	//路由开始
	var history = Backbone.history.start();
	console.log("history:",history);
});