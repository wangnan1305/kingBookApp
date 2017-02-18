//小编懂你item视图
window.ebookweb.views.components.XiaoBianItemView = window.ebookweb.views.ItemBaseView.extend({
	tagName:"section",
	className:"item-view top",
	attributes:{
		
	},
	template:_.template($("#xiaobian_item_view_template").html()),
	events:{
		//事件
		"click ul figure a":"onBookLinkClick",
		"click .more a":"onMoreLinkClick"
	},
	initialize:function(){
		//初始化
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},
	onBookLinkClick:function(e)
	{
		//书链接点击
		console.log("小编推荐书籍点击",e.currentTarget);

		var p5 = "6";
		if(this.model.get("stat_p5"))
		{
			p5 = this.model.get("stat_p5");
		}

		if(p5=="5")
		{
			//搜索结果页面
			ka(
				'info',
				'p4=2&p5='+p5+'&p6=3&p7=' + $(e.currentTarget).data("title")
			);

			console.log("搜索结果页面:",'p4=2&p5='+p5+'&p6=3&p7=' + $(e.currentTarget).data("title"));
		}
		else
		{
			ka(
				'info',
				'p4=2&p5='+p5+'&p6=2&p7=2&p8=' + StatMap[$(e.currentTarget).data("completed")] + '&p9=' + $(e.currentTarget).data("title") + '&p10=' + $(e.currentTarget).data("bookid")
			);
		}

		var url = $(e.currentTarget).attr("href");
		return window.ebookweb.utils.openBookWeb(url);
	},
	onMoreLinkClick:function()
	{
		console.log("点击更多");
		ka(
			'info',
			'p4=2&p5=6&p6=3&p7=3'
		);
	}
});