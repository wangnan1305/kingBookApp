//书列表视图
window.ebookweb.views.components.BookListView = window.ebookweb.views.ItemBaseView.extend({
	tagName:"ul",
	template:_.template($("#book_list_view_template").html()),
	events:{
		//事件
	},
	initialize:function(){
		//初始化
		this.books = this.model.get("books") || new window.ebookweb.models.BookList();
		this.listenTo(this.books,"add",this.addBookItem);

		this.model.set({books:this.books});

		this.curpage = this.model.get("curpage") || 1;//当前页面
		this.isLoading = false;//是否正在加载
		this.hasMore = true;//是否还有更多
		this.stopAutoLoad = false;//是否停止自动加载
		this.isLoaded = false;//是否已经加载过书籍
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));

		this.container = this.$el;
		this.moreItem = this.$(".more-data");
		this.container.scrollTop(0);

		for(var i = 0;i<this.books.length;i++)
		{
			this.addBookItem(this.books.at(i));
		}

		var autoLoad = this.model.get("autoLoad") || false;
		if(!autoLoad)
		{
			//不自动加载
			console.log("不自动加载");
			// this.moreItem.hide();
			this.moreItem.css("background","none");
			this.moreItem.html("没有更多了");
		}
		else
		{
			this.moreItem.show();
			console.log("自动加载:",autoLoad);
			$(window).off("scroll");

			var self = this;
			setTimeout(function(){
				console.log("定时器加上滚动监听");
				$(window).on("scroll",self.onWindowScroll.bind(self));
			},500);
			// $(window).on("scroll",this.onWindowScroll.bind(this));
			if(!this.isLoaded) this.loadBooks();
		}

		this.moreItem.show();
		console.log("是否自动加载:",autoLoad,this.moreItem);

		console.log(this.model.toJSON());

		//监听相关页面事件,清除窗体滚动事件
		window.ebookweb.mediator.on(window.ebookweb.events.GO_TO_MAIN_PAGE_EVENT,this.destroy,this);
		window.ebookweb.mediator.on(window.ebookweb.events.POPUP_PAGE_EVENT,this.destroy,this);

		return this;
	},
	onWindowScroll:function(e){
		//滚动了
		var needLoad = ($(window).scrollTop() > this.container.height() - $(window).height() - 100);
		this.hasMore = true;
		if(needLoad && !this.isLoading && this.hasMore && !this.stopAutoLoad)
		{
			this.curpage++;
			this.model.set("curpage",this.curpage);
			this.loadBooks();
		}
	},
	loadBooks:function(){
		console.log("加载书籍");

		this.moreItem.show();

		this.isLoading = true;
		this.isLoaded = true;

		$.ajax({
			url:this.model.get("autoLoadURL"),
			method:"get",
			data:{
				page:this.curpage
			},
			dataType:"json",
			context:this
		}).always(function(result){
			console.log("loadBooks:",result);

			if(_.isArray(result) && !_.isEmpty(result))
			{
				this.addBooks(result);

				console.log("loadBooks size:",result.length);

				if(result.length<10)
				{
					this.moreItem.html("没有更多了");
				}
			}
			else if(result.code == 200 && _.isArray(result.data) && !_.isEmpty(result.data))
			{
				this.addBooks(result.data);

				if(result.data.length<=result.totalsize)
				{
					this.moreItem.html("没有更多了");
				}
			}
			else
			{
				this.hasMore = false;
				this.moreItem.html("没有更多了");
			}

			this.isLoading = false;
		});
	},
	addBookItem:function(data)
	{
		//添加了一本书
		var itemView = new window.ebookweb.views.components.BookListItemView({model:data});
		$(itemView.render().el).insertBefore(this.moreItem);
	},
	addBooks:function(list)
	{
		//添加一组书籍
		_.each(list,function(item,index){
			item["readCountFormated"] = window.ebookweb.utils.Calculator.fixedCount(item["readCount"]);
			item["wordCountFormated"] = window.ebookweb.utils.Calculator.fixedCount(item["wordCount"]);
			item["navtitle"] = this.model.get("title");

			var data = this.model.toJSON();
			data.data = item;

			this.books.add(new window.ebookweb.models.BookItem(data));
		},this);
	},
	destroy:function(){
		//销毁
		console.log("销毁booklist",this.$el.parent());
		$(window).off("scroll");
	}
});