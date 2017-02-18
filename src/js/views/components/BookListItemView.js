//书列表item视图
window.ebookweb.views.components.BookListItemView = window.ebookweb.views.ItemBaseView.extend({
	tagName:"li",
	className:"fig-word bd-bottom",
	template:_.template($("#book_list_item_view_template").html()),
	events:{
		//事件
		"click a":"onBookLinkClick"
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
		var p5 = this.model.get("stat_p5");

		console.log("书列表item点击,p5=",p5,e.currentTarget,this.model.toJSON());
		
		switch(p5)
		{
			case "5"://搜索结果页面
				ka(
					'info',
					'p4=2&p5=' + p5 +//统计的页面来源
					'&p6=1&p7=' + $(e.currentTarget).data("title") +
					'&p8=' + $(e.currentTarget).data("score")
				);
			break;
			case "14"://排行榜列表页面
			case "15":
			case "16":
			case "17":
			case "18":
			case "19":
				var p8 = ($(e.currentTarget).data("isfromweb") == "0" ?1:2);
				ka(
					'info',
					'p4=2&p5=' + p5 +//统计的页面来源
					'&p6=1&p7=' + this.model.get("stat_p7")+"&p8="+p8+"&p9="+StatMap[$(e.currentTarget).data("completed")]+"&p10="+$(e.currentTarget).data("title")
				);
			break;
			default://默认页面
				var isfromweb = $(e.currentTarget).data("isfromweb");
				isfromweb = (isfromweb=="1" ?1:2);
				ka(
					'info',
					'p4=2&p5=' + p5 +//统计的页面来源
					'&p6=1&p7=' + isfromweb +
					'&p8=' + StatMap[$(e.currentTarget).data("completed")] +
					'&p9=' + $(e.currentTarget).data("title") +
					'&p10=' + $(e.currentTarget).data("score")
				);
			break;
		}

		var url = $(e.currentTarget).attr("href");
		return window.ebookweb.utils.openBookWeb(url);
	}
});