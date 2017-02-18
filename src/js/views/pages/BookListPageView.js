//一般书籍列表页面视图
window.ebookweb.views.pages.BookListPageView = window.ebookweb.views.PageBaseView.extend({
	id:"booklist",
	className:"main-container book-list-page",
	template:_.template($("#book_list_page_template").html()),
	events:{
		//事件
		"click .nav-bar .left a":"onBackClick",
		"click .nav-bar .search":"onSearchLinkClick",//搜索
		"click .nav-bar .last-read":"onLastReadLinkClick"//最近阅读
	},
	visitStats:{
		"重磅推荐":"p5=2",
		"小编懂你":"p5=3",
		"男生爱看":"p5=4",
		"女生爱看":"p5=5",
		"新书首发":"p5=6",
		"言情":"p5=32",
		"都市":"p5=33",
		"玄幻":"p5=34",
		"仙侠":"p5=35",
		"穿越":"p5=36",
		"官场":"p5=37",
		"奇幻":"p5=38",
		"灵异":"p5=39",
		"武侠":"p5=40",
		"科幻":"p5=41",
		"历史":"p5=42",
		"游戏":"p5=43",
		"笑话":"p5=44",
		"校园":"p5=45",
		"军事":"p5=46",
		"生活休闲":"p5=47",
		"影视剧本":"p5=48",
		"文学小说":"p5=49",
		"文史传记":"p5=50",
		"经管励志":"p5=51",
		"社科科普":"p5=52",
		"教育教辅":"p5=53",
		"情感小说":"p5=54",
		"灵异悬疑":"p5=55"
	},
	initialize:function(){
		//初始化
		this.bookListView = new window.ebookweb.views.components.BookListView({
			model:new window.ebookweb.models.ItemViewModel({
				autoLoad:this.model.get("autoLoad")||false,
				autoLoadURL:this.model.get("autoLoadURL")||null,
				data:this.model.get("data"),
				title:this.model.get("title"),
				stat_p5:this.model.get("stat_p5") || 0,
			})
		});

		console.log("book list page stat_p5:",this.model.get("title"),this.bookListView.model.get("stat_p5"));

		//列表页面访问埋点
		var title = this.model.get("title");
		console.log("书籍列表访问埋点:",title,this.visitStats[title],this.model.toJSON());
		if(this.visitStats[title])
		{
			//有标题可以识别的
			ka(
				'info',
				'p4=1&'+this.visitStats[title]+(this.model.get("stat_p6") ?"&p6="+this.model.get("stat_p6"):"")
			);
		}
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));
		this.$("section").append(this.bookListView.render().el);
		this.bookListView.addBooks(this.model.get("data"));

		this.$("section").scrollTop(0);
		$(window).scrollTop(0);

		return this;
	},
	onSearchLinkClick:function(){
		//搜索点击
		console.log("点击搜索");
		ka(
			'info',
			'p4=2&p5=1&p6=2'
		);
	},
	onLastReadLinkClick:function(){
		//最近阅读点击
		console.log("点击最近阅读");
		ka(
			'info',
			'p4=2&p5=1&p6=1'
		);
	},
	onBackClick:function(){
		//点击返回
		console.log("返回");
		// window.history.back();
	}
});