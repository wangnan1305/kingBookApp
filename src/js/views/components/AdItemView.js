//广告item视图
window.ebookweb.views.components.AdItemView = window.ebookweb.views.ItemBaseView.extend({
	tagName:"a",
	className:"ad item-view",
	template:_.template($("#ad_item_view_template").html()),
	events:{
		//事件
		"click":"onClick"
	},
	initialize:function(){
		//初始化
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},
	onClick:function(){
		console.log("点击广告位");

		ka(
			'info',
			'p4=2&p5=6&p6=5&p7=' + this.$(".content").html()
		);

		return true;
	}
});