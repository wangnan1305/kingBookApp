//正在加载中视图
window.ebookweb.views.pages.LoadingPageView = window.ebookweb.views.PageBaseView.extend({
	className:"loading-page",
	template:_.template($("#loading_view_template").html()),
	events:{

	},
	initialize:function(){
		//初始化
	},
	render:function(){
		//渲染
		this.$el.html(this.template());
		this.$el.css("height",$(document).height());

		console.log("h:",$(window).height(),$(document).height());

		return this;
	}
});