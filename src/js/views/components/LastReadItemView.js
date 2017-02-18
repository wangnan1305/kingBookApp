//最近阅读item视图
window.ebookweb.views.components.LastReadItemView = window.ebookweb.views.ItemBaseView.extend({
	tagName:"a",
	className:"last-read-item item-view",
	template:_.template($("#last_read_item_view_template").html()),
	events:{
		//事件
		"click":"onClick"
	},
	initialize:function(){
		//初始化
		this.listenTo(this.model,"change",this.render);
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.hide();

		return this;
	},
	onClick:function(){
		console.log("点击继续阅读");

		ka(
			'info',
			'p4=2&p5=6&p6=1'
		);

		var url = this.model.get("data")["url"];

		return window.ebookweb.utils.openBookWeb(url,"webview");
	}
});