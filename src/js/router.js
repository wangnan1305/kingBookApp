//路由
window.ebookweb.Router = Backbone.Router.extend({
	routes:{
		//路径
		"":"main",
		"close":"close",
		"main/:tab":"mainTab",
		"books/:type/:title":"bookList",
		"books/:type/:title/:cateId":"bookList",
		"books/:type/:title/:cateId/:cateName":"bookList",
		"books/:type/:title/:cateId/:cateName/:statP5":"bookList",
		"books/:type/:title/:cateId/:cateName/:statP5/:statP6":"bookList",
		"search":"search",
		"search/":"search",
		"search/:keyword":"search",
		"latest-readed":"lastestReaded",
		"ranks/:rankid/:rankname":"rankList",
		"book/detail/:bookid/:title":"bookDetail",
		"book/catalog/:bookid":"bookCatalog"
	},
	close:function(e){
		//关闭webview
		console.log("关闭web");
		if(window.splash) window.splash.onBackPressed(true);//退出当前webview

		return false;
	},
	main:function(){
		//首页
		console.log("去首页");
		window.ebookweb.mediator.trigger(window.ebookweb.events.GO_TO_MAIN_PAGE_EVENT);
	},
	mainTab:function(tab){
		//去首页的标签页面
		window.ebookweb.mediator.trigger(window.ebookweb.events.CHANGE_MAIN_PAGE_TAB_EVENT,tab);
	},
	lastestReaded:function(){
		//去最近阅读
		console.log("去最近阅读页面");

		var data = new window.ebookweb.models.PageViewModel({
		});
		var page = new window.ebookweb.views.pages.LastReadPageView({model:data});
		window.ebookweb.mediator.trigger(window.ebookweb.events.POPUP_PAGE_EVENT,page);
	},
	loadGlobalData:function(callback)
	{
		//获取全局数据,暂时解决办法
		$.ajax({
			url:window.ebookweb.config.api_host+"index",
			method:"get",
			data:null,
			dataType:"json",
			context:this
		}).always(function(result){
			//结果,目前返回是一个数据对象,之后加上错误码判断
			window.ebookweb.data.GlobalData["main"] = result;
			if(callback) callback();
		});
	},
	bookList:function(type,title,cateId,cateName,stat_p5,stat_p6){
		//首页-精选
		var page_uuid = type+"_"+title+"_"+cateId+"_"+cateName+"_"+stat_p5+"_"+stat_p6;
		
		console.log("去书籍列表页面,page_uuid=",page_uuid,"p5=",stat_p5,"p6=",stat_p6,type);

		console.log(this["bookListPageId"] || "无this['bookListPageId']");

		if(this["bookListPageId"] && page_uuid == this["bookListPageId"])
		{
			//缓存的上一相同的页面
			console.log("相同的页面");

			var page = this.bookListPage;
			window.ebookweb.mediator.trigger(window.ebookweb.events.POPUP_PAGE_EVENT,page);
			return;
		}

		this["bookListPageId"] = page_uuid;

		var data;
		switch(type)
		{
			case "recommend"://重磅推荐
				if(window.ebookweb.data.GlobalData["main"]&&window.ebookweb.data.GlobalData["main"]["emphasis"])
				{
					var books = window.ebookweb.data.GlobalData["main"]["emphasis"];
					data = new window.ebookweb.models.PageViewModel({
						title:title,
						pageid:"recommend",
						autoLoad:false,
						data:books,
						stat_p5:stat_p5
					});
				}
				else
				{
					this.loadGlobalData(function(){
						var books = window.ebookweb.data.GlobalData["main"]["emphasis"];
						data = new window.ebookweb.models.PageViewModel({
							title:title,
							pageid:"recommend",
							autoLoad:false,
							data:books,
							stat_p5:stat_p5
						});

						var page = new window.ebookweb.views.pages.BookListPageView({model:data});
						window.ebookweb.mediator.trigger(window.ebookweb.events.POPUP_PAGE_EVENT,page);
					});
				}
			break;
			case "xiaobian"://小编懂你
				if(window.ebookweb.data.GlobalData["main"]&&window.ebookweb.data.GlobalData["main"]["xiaobian"])
				{
					var books = window.ebookweb.data.GlobalData["main"]["xiaobian"];
					data = new window.ebookweb.models.PageViewModel({
						title:title,
						pageid:"recommend",
						autoLoad:false,
						data:books,
						stat_p5:stat_p5
					});
				}
				else
				{
					this.loadGlobalData(function(){
						var books = window.ebookweb.data.GlobalData["main"]["xiaobian"];
					data = new window.ebookweb.models.PageViewModel({
						title:title,
						pageid:"recommend",
						autoLoad:false,
						data:books,
						stat_p5:stat_p5
					});

						var page = new window.ebookweb.views.pages.BookListPageView({model:data});
						window.ebookweb.mediator.trigger(window.ebookweb.events.POPUP_PAGE_EVENT,page);
					});
				}
			break;
			case "men"://男生爱看
				if(window.ebookweb.data.GlobalData["main"]&&window.ebookweb.data.GlobalData["main"]["men"])
				{
					var books = window.ebookweb.data.GlobalData["main"]["men"];
					data = new window.ebookweb.models.PageViewModel({
						title:title,
						pageid:"recommend",
						autoLoad:false,
						data:books,
						stat_p5:stat_p5
					});
				}
				else
				{
					this.loadGlobalData(function(){
						var books = window.ebookweb.data.GlobalData["main"]["men"];
					data = new window.ebookweb.models.PageViewModel({
						title:title,
						pageid:"recommend",
						autoLoad:false,
						data:books,
						stat_p5:stat_p5
					});

						var page = new window.ebookweb.views.pages.BookListPageView({model:data});
						window.ebookweb.mediator.trigger(window.ebookweb.events.POPUP_PAGE_EVENT,page);
					});
				}
			break;
			case "women"://女生爱看
				if(window.ebookweb.data.GlobalData["main"]&&window.ebookweb.data.GlobalData["main"]["women"])
				{
					var books = window.ebookweb.data.GlobalData["main"]["women"];
					data = new window.ebookweb.models.PageViewModel({
						title:title,
						pageid:"recommend",
						autoLoad:false,
						data:books,
						stat_p5:stat_p5
					});
				}
				else
				{
					this.loadGlobalData(function(){
						var books = window.ebookweb.data.GlobalData["main"]["women"];
					data = new window.ebookweb.models.PageViewModel({
						title:title,
						pageid:"recommend",
						autoLoad:false,
						data:books,
						stat_p5:stat_p5
					});

						var page = new window.ebookweb.views.pages.BookListPageView({model:data});
						window.ebookweb.mediator.trigger(window.ebookweb.events.POPUP_PAGE_EVENT,page);
					});
				}
			break;
			case "newbook"://新书首发
				if(window.ebookweb.data.GlobalData["main"]&&window.ebookweb.data.GlobalData["main"]["newBook"])
				{
					var books = window.ebookweb.data.GlobalData["main"]["newBook"];
					data = new window.ebookweb.models.PageViewModel({
						title:title,
						pageid:"recommend",
						autoLoad:false,
						data:books,
						stat_p5:stat_p5
					});
				}
				else
				{
					this.loadGlobalData(function(){
						var books = window.ebookweb.data.GlobalData["main"]["newBook"];
						data = new window.ebookweb.models.PageViewModel({
							title:title,
							pageid:"recommend",
							autoLoad:false,
							data:books,
							stat_p5:stat_p5
						});

						var page = new window.ebookweb.views.pages.BookListPageView({model:data});
						window.ebookweb.mediator.trigger(window.ebookweb.events.POPUP_PAGE_EVENT,page);
					});
				}
			break;
			case "authorbooks"://作者还写过
				data = new window.ebookweb.models.PageViewModel({
					title:title,
					pageid:"authorbooks",
					autoLoad:true,
					autoLoadURL:window.ebookweb.config.api_host+"book/books-by-author?authorid="+cateId,
					data:null,
					stat_p5:stat_p5
				});
			break;
			default:
				data = new window.ebookweb.models.PageViewModel({
					title:title,
					pageid:"recommend",
					autoLoad:true,
					autoLoadURL:window.ebookweb.config.api_host+"category?id="+cateId+"&type=week",
					data:books,
					stat_p5:stat_p5,
					stat_p6:stat_p6
				});
			break;
		}

		if(!data) return;

		console.log("data:",data.toJSON());

		var page = this.bookListPage = new window.ebookweb.views.pages.BookListPageView({model:data});
		window.ebookweb.mediator.trigger(window.ebookweb.events.POPUP_PAGE_EVENT,page);

		page.delegateEvents(page.events);
	},
	rankList:function(rankId,rankName)
	{
		//去排行榜列表
		console.log("去排行榜列表:",rankId,rankName);

		var data = new window.ebookweb.models.PageViewModel({
			title:rankName,
			pageid:"ranks",
			rankId:rankId,
			rankName:rankName,
			autoLoad:true,
			autoLoadURL:window.ebookweb.config.api_host+"duration?id="+rankId
		});
		var page = new window.ebookweb.views.pages.RankListPageView({model:data});
		window.ebookweb.mediator.trigger(window.ebookweb.events.POPUP_PAGE_EVENT,page);

		//统计
	},
	search:function(keyword){
		//搜索页面
		console.log("去搜索页面");

		if(window.ebookweb.data.GlobalData["main"]&&window.ebookweb.data.GlobalData["main"]["hotBook"])
		{
			var books = window.ebookweb.data.GlobalData["main"]["hotBook"];
			var data = {
				pageid:"search",
				data:{
					keyword:keyword,
					recommend:window.ebookweb.data.GlobalData["main"]["searchRecommend"],
					hotBook:window.ebookweb.data.GlobalData["main"]["hotBook"],
					history:new window.ebookweb.models.SearchHistoryList()
				}
			};
			var page = new window.ebookweb.views.pages.SearchPage({model:new window.ebookweb.models.PageViewModel(data)});
			window.ebookweb.mediator.trigger(window.ebookweb.events.POPUP_PAGE_EVENT,page);
		}
		else
		{
			this.loadGlobalData(function(){
				var books = window.ebookweb.data.GlobalData["main"]["hotBook"];
				var data = {
					pageid:"search",
					data:{
						keyword:keyword,
						recommend:window.ebookweb.data.GlobalData["main"]["searchRecommend"],
						hotBook:window.ebookweb.data.GlobalData["main"]["hotBook"],
						history:new window.ebookweb.models.SearchHistoryList()
					}
				};
				var page = new window.ebookweb.views.pages.SearchPage({model:new window.ebookweb.models.PageViewModel(data)});
				window.ebookweb.mediator.trigger(window.ebookweb.events.POPUP_PAGE_EVENT,page);
			});
		}
	},
	bookDetail:function(bookid,title){
		console.log("去书籍详情页面",bookid,title);
		//
		var data = new window.ebookweb.models.PageViewModel({
			title:title,
			bookid:bookid,
			catalog:null,
			authorBooks:null,
			readerBooks:null
		});
		var page = new window.ebookweb.views.pages.BookDetailPageView({model:data});
		window.ebookweb.mediator.trigger(window.ebookweb.events.POPUP_PAGE_EVENT,page);
	},
	bookCatalog:function(bookid){
		console.log("去书籍目录页面",bookid);
		var data = new window.ebookweb.models.PageViewModel({
			title:"目录",
			bookid:bookid,
			catalog:null,
			authorBooks:null,
			readerBooks:null
		});
		var page = new window.ebookweb.views.pages.BookCatalogPageView({model:data});
		window.ebookweb.mediator.trigger(window.ebookweb.events.POPUP_PAGE_EVENT,page);
	}
});