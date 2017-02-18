//最近阅读页面视图
window.ebookweb.views.pages.LastReadPageView = window.ebookweb.views.PageBaseView.extend({
	id:"last_read",
	className:"main-container last-read-page",
	template:_.template($("#last_read_page_template").html()),
	events:{
		//事件
		"click .nav-bar .left a":"onBackClick",
		"click .nav-bar .search":"onSearchLinkClick",//搜索
		"click .nav-bar .book-shop":"onBookShopLinkClick",//书城
		"click .fig a":"onBookLinkClick",
		"click .empty .nav":"onEmptyBookShopLinkClick"
	},
	initialize:function(){
		//初始化
		this.loaded = false;
		this.model.set({dataisloaded:false});
		this.listenTo(this.model,"change:data",this.render);
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));

		if(!this.loaded)
		{
			this.loaded = true;

			$.ajax({
				url:window.ebookweb.config.api_host+"book/recent-read",
				method:"get",
				data:{

				},
				dataType:"json",
				context:this
			}).always(function(result){
				//最近阅读结果返回
				console.log("最近阅读结果:",result);

				this.model.set({dataisloaded:true,data:result.bookmarkList ||[]});

				//访问埋点
				if(this.model.get("data").length>0)
				{
					//有
					ka(
						'info',
						'p4=1&p5=11&p6=1'
					);
				}
				else
				{
					//无
					ka(
						'info',
						'p4=1&p5=11&p6=2'
					);
				}
			});
		}

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
	onBookShopLinkClick:function(){
		//书城点击
		console.log("点击书城");
		ka(
			'info',
			'p4=2&p5=1&p6=3'
		);
	},
	onEmptyBookShopLinkClick:function(){
		//空白无最近阅读页面点击去书城
		console.log("点击空白页去书城");
		ka(
			'info',
			'p4=2&p5=3&p6=1'
		);
	},
	onBackClick:function(){
		//点击返回
		console.log("返回");
		window.history.back();
	},
	onBookLinkClick:function(e){
		//点击读书链接
		console.log("点击读书链接",e.currentTarget);
		ka(
			'info',
			'p4=2&p5=2&p6=1&p7='+$(e.currentTarget).data("title")
		);

		var url = $(e.currentTarget).attr("href");
		return window.ebookweb.utils.openBookWeb(url);
	}
});