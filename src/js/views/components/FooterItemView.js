//footer item视图
window.ebookweb.views.components.FooterItemView = window.ebookweb.views.ItemBaseView.extend({
	tagName:"footer",
	className:"footer-right",
	template:_.template($("#footer_item_view_template").html()),
	events:{
		//事件
	},
	initialize:function(){
		//初始化
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	}
});