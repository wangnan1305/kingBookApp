//重磅推荐item视图
window.ebookweb.views.components.RecommendsItemView = window.ebookweb.views.ItemBaseView.extend({
	tagName:"section",
	className:"item-view top",
	attributes:{
		
	},
	template:_.template($("#recommend_item_view_template").html()),
	events:{
		//事件
		"click ol li a.read":"onBookLinkClick",
		"click ol .more a":"onMoreLinkClick"
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
	onMoreLinkClick:function(){
		//点击更多
		// var data = new PageViewModel({
		// 	title:"重磅推荐",
		// 	pageid:"recommend",
		// 	autoLoad:false,
		// 	data:this.model.get("data"),
		// 	stat_p5:7
		// });

		// console.log(data.toJSON());

		// var page = new BookListPageView({model:data});
		// mediator.trigger(POPUP_PAGE_EVENT,page);
		console.log("点击更多");
		ka(
			'info',
			'p4=2&p5=6&p6=3&p7=1'
		);

		return true;
	},
	onBookLinkClick:function(e){
		//读书点击
		console.log("读书点击监测",$(e.currentTarget));

		ka(
			'info',
			'p4=2&p5=6&p6=2&p7=1&p8=' + StatMap[$(e.currentTarget).data("completed")] + '&p9=' + $(e.currentTarget).data("title") + '&p10=' + $(e.currentTarget).data("bookid")
		);

		var url = $(e.currentTarget).attr("href");
		return window.ebookweb.utils.openBookWeb(url);
	}
});