//排行榜书籍列表页面视图
window.ebookweb.views.pages.RankListPageView = window.ebookweb.views.PageBaseView.extend({
	id:"main",
	className:"main-container for-sub-tab rank-list-page",
	template:_.template($("#rank_list_page_template").html()),
	stats:{//大分类埋点标识
		'畅销榜': '14',
		'人气榜': '15',
		'飙升榜': '16',
		'热搜榜': '17',
		'推荐榜': '18',
		'完结榜': '19'
	},
	events:{
		//事件
		"click .nav-bar .left a":"onBackClick",
		"click nav ul li":"onTabButtonClick",
		"click .nav-bar .search":"onSearchLinkClick",//搜索
		"click .nav-bar .last-read":"onLastReadLinkClick"//最近阅读
	},
	initialize:function(){
		//初始化
		this.tabs = ["week","month","all"];
		this.tabsScrollPosition = {
			week:0,
			month:0,
			all:0
		};
		this.curtab = this.tabs[0];
		this.bookListViewModels = {};
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));

		for(var i = 0;i<this.tabs.length;i++)
		{
			var data = {
				navtitle:this.model.get("title"),
				curpage:1,
				stat_p5:this.stats[this.model.get("title")],//统计来源
				stat_p7:i+1,
				books:new window.ebookweb.models.BookList(),
				autoLoad:true,
				autoLoadURL:this.model.get("autoLoadURL")||null
			};
			data["autoLoadURL"]+="&type="+this.tabs[i];//加载数据接口拼接

			this.bookListViewModels[this.tabs[i]] = new window.ebookweb.models.ItemViewModel(data);
		}

		this.showBookListViewByIndex(0);
		$(window).scrollTop(0);

		return this;
	},
	onBackClick:function(){
		//点击返回
		console.log("返回");
		window.history.back();
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
	onTabButtonClick:function(e){
		//标签点击
		var index = $(e.currentTarget).index();
		this.showBookListViewByIndex(index);

		ka(
			'info',
			'p4=2&p5='+this.stats[this.model.get("title")]+'&p6='+(index+2)
		);
	},
	showBookListViewByIndex:function(index){
		//根据位置显示书籍列表
		console.log("showBookListViewByIndex:",index);

		//访问埋点
		var tab_stats = {
			"畅销榜":[13,14,15],
			"人气榜":[16,17,18],
			"飙升榜":[19,20,21],
			"热搜榜":[22,23,24],
			"推荐榜":[25,26,27],
			"完结榜":[28,29,30]
		};
		ka(
			'info',
			'p4=1&p5='+tab_stats[this.model.get("title")][index]
		);
		//访问埋点结束

		this.tabsScrollPosition[this.curtab] = $(window).scrollTop();//记录滚动位置

		if(this.bookListView)
		{
			//有旧的
			this.bookListView.destroy();
			this.bookListView.remove();
		}

		this.$("nav ul li").removeClass();
		this.$("nav ul li:eq("+index+")").addClass("active");

		this.curtab = this.tabs[index];

		var data = this.bookListViewModels[this.curtab];//存储的数据对象
		var books = data.get("books").toJSON();

		this.bookListView = new window.ebookweb.views.components.BookListView({
			model:data
		});

		console.log("books:",books);

		// if(books.length>0) this.bookListView.addBooks(books);//把之前加载的数据加上去

		this.$("section ul .rank-"+this.tabs[index]).append(this.bookListView.render().el);

		//隐藏和显示
		this.$("ul div").hide();
		this.$("ul .rank-"+this.curtab).show();

		//滚动到历史位置
		$(window).scrollTop(this.tabsScrollPosition[this.curtab]);
	}
});