//女生爱看item视图
window.ebookweb.views.components.WomenItemView = window.ebookweb.views.ItemBaseView.extend({
	tagName:"section",
	className:"like-see item-view top",
	attributes:{
	},
	template:_.template($("#women_item_view_template").html()),
	events:{
		//事件
		"click ol li a":"onBookLinkClick",
		"click .more a":"onMoreLinkClick"
	},
	initialize:function(){
		//初始化

		//转换数据
		var list = this.model.get("data");
		_.each(list,function(item,index){
			item["readCountFormated"] = window.ebookweb.utils.Calculator.fixedCount(item["readCount"]);
		});
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},
	onBookLinkClick:function(e)
	{
		//书链接点击
		console.log("女生爱看书籍点击",e.currentTarget);

		ka(
			'info',
			'p4=2&p5=6&p6=2&p7=4&p8=' + StatMap[$(e.currentTarget).data("completed")] + '&p9=' + $(e.currentTarget).data("title") + '&p10=' + $(e.currentTarget).data("bookid")
		);

		var url = $(e.currentTarget).attr("href");
		return window.ebookweb.utils.openBookWeb(url);
	},
	onMoreLinkClick:function()
	{
		console.log("点击更多");
		ka(
			'info',
			'p4=2&p5=6&p6=3&p7=5'
		);
	}
});