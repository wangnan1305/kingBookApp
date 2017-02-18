//搜索页面
window.ebookweb.views.pages.SearchPage = window.ebookweb.views.PageBaseView.extend({
	tagName:"div",
	id:"search",
	className:"main-container search-page",
	template:_.template($("#search_page_template").html()),
	events:{
		//事件
		"click header .nav.back":"onBackClick",
		"click form button":"onClearButtonClick",
		"keydown form input":"onKeyDown",
		"focusin form input":"onFocusIn",
		"focusout form input":"onFocusOut",
		"keydown form input":"onKeyDown",
		"click .page-control .prev":"prevPage",
		"click .page-control .next":"nextPage",
		"click .search-history h3 button":"clearHistory",
		"click .search-history ul li a":"onSearchHistoryItemClick",
		"click .hot-book ul li a":"onHotBooksItemClick",
		"click .hot-book h3 button":"onGetHotKeywordsClick"
	},
	initialize:function(){
		//初始化
		this.curpage = 1;
		this.keyword = "";
		this.lastpagesize = 0;
		this.gotSearchResult = false;//是否获取到搜索结果

		var data = this.model.get("data");
		var history = data["history"];
		history.fetch();//本地获取搜索记录

		//转换
		data["historyList"] = history.toJSON().reverse();//反转,最新的在前面

		//访问埋点
		ka(
			'info',
			'p4=1&p5=9'
		);
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));

		this.historyItem = this.$(".search-history");

		//搜索记录
		var history = this.model.get("data")["history"];
		if(history.length<=0)
		{
			// this.$(".search-history").hide();
		}

		var keyword = $.trim(this.model.get("data")["keyword"]);
		if(keyword){
			this.$("form input").val(keyword);
			this.curpage = 1;
			this.keyword = keyword;
			this.loadBooks();
			this.addHistory(keyword);//增加历史记录
		}else{
			//自动获取焦点尝试
			var self = this;
			this.$("form input").focus();
			setTimeout(function(){
				self.$("form input").focus();
			},500);
		}
		return this;
	},
	addHistory:function(keyword){
		if($.trim(keyword).length == 0){
			return;
		}
		//添加一个历史记录
		var data = this.model.get("data");
		var history = data["history"];
		history.fetch();//本地获取搜索记录

		// this.$(".search-history").show();

		console.log("add:",keyword);

		//销毁同名的
		var sames = history.where({keyword:keyword});
		for(var i = 0;i<sames.length;i++)
		{
			sames[i].destroy();
		}

		//添加到列表
		var item = _.template($("#search_page_history_item_template").html())({keyword:keyword});

		this.$(".search-history a[data-keyword='" + keyword + "']").parent().remove();
		this.$(".search-history ul").prepend(item);

		//创建
		history.create({
			keyword:keyword
		});
	},
	clearHistory:function(){
		//清空历史搜索记录
		var history = this.model.get("data")["history"];
		history.fetch();

		console.log("清空历史搜索记录:",history.toJSON());

		_.each(history.models.concat(),function(item,index){
			try
			{
				console.log(index);
				item.destroy();
			}
			catch(e)
			{
				console.log("清空出错:",e);
			}
		});

		history.reset();

		console.log("清空");

		//
		this.$(".search-history ul").html("");

		ka('info', 'p4=2&p5=4&p6=5');//统计
	},
	onSearchHistoryItemClick:function(e){
		//点击历史搜索关键字
		var keyword = $(e.currentTarget).data("keyword");
		this.$("form input").val(keyword);

		console.log("点击历史搜索:",keyword,e.currentTarget);

		this.curpage = 1;
		this.keyword = keyword;

		ka('info', 'p4=2&p5=4&p6=4&p7=' + this.keyword);//统计

		this.loadBooks();

		return true;
	},
	onGetHotKeywordsClick:function(){
		console.log("换一批热搜词");

		ka('info', 'p4=2&p5=4&p6=6');//统计

		$.ajax({
			url:window.ebookweb.config.api_host+"hotBook",
			method:"get",
			data:null,
			dataType:"json",
			context:this
		}).always(function(result){
			//结果,目前返回是一个数据对象,之后加上错误码判断
			console.log(result);
			if(!_.isEmpty(result))
			{
				var html = _.template($("#search_page_hot_book_item_template").html())({infos:result});
				this.$(".hot-book ul").html(html);
			}
			else
			{
				alert("没有数据");
			}
		});
	},
	onHotBooksItemClick:function(e){
		//大家都在搜索书籍点击
		var keyword = $.trim($(e.currentTarget).data("keyword"));
		if(this.$(".result").is(":hidden"))
		{
			//未搜索
			ka(
				'info',
				'p4=2&p5=4&p6=3&p7=' + keyword
			);

			console.log("大家都在搜:","p4=2&p5=4&p6=3&p7=");
		}
		else
		{
			//搜索结果页面
			ka(
				'info',
				'p4=2&p5=5&p6=2&p7=' + keyword
			);

			console.log("搜索结果页面,大家都在搜:","p4=2&p5=4&p6=3&p7=");
		}

		this.$("form input").val(keyword);
		this.curpage = 1;
		this.keyword = keyword;
		this.loadBooks();
		this.addHistory(keyword);//增加历史记录
		return true;
	},
	onBackClick:function(){
		//点击返回
		console.log("取消搜索");
		ka('info', 'p4=2&p5=4&p6=2');//统计
		window.history.back();
	},
	onClearButtonClick:function(){
		//清除按钮
		this.$("form input").val("");
	},
	onKeyDown:function(e){
		//回车
		if(e.keyCode == 13)
		{
			this.$("form input").blur();

			var keyword = $.trim(this.$("form input").val());
			this.$("form input").val(keyword);//去掉两端空格
			//如果没有输入搜索关键字，则使用 placeholder 作为关键字
			if(keyword.length == 0){
				keyword = $.trim(this.$("form input").attr("placeholder"));
			}
			if(keyword.length>0)
			{
				this.curpage = 1;
				this.keyword = keyword;

				ka('info', 'p4=2&p5=4&p6=1&p7=' + keyword);//搜索统计

				this.loadBooks();//加载
				this.addHistory(keyword);//增加历史记录
			}
			else
			{
				console.log("关键字不能为空");
			}

			this.$("form input").blur();
		}
	},
	prevPage:function(){
		//上一页
		if(this.isLoading) return;
		
		console.log("上一页");
		this.curpage--;
		if(this.curpage<1) this.curpage=1;

		this.loadBooks();
	},
	nextPage:function(){
		//下一页
		if(this.isLoading) return;

		console.log("下一页");
		this.curpage++;

		this.loadBooks();
	},
	onFocusIn:function(){
		this.$(".result").hide();
		if(this.xiaobian) this.xiaobian.$el.hide();
		if(this.historyItem) this.historyItem.show();

		//重新绑定事件
		this.delegateEvents(this.events);

		console.log("输入框获取到了焦点,重新返回搜索状态");

		ka('info', 'p4=2&p5=1&p6=2');//统计
	},
	onFocusOut:function(e){
		// if(this.gotSearchResult) this.$(".result").show();

		return true;
	},
	loadBooks:function(){
		if(this.isLoading) {
			return;
		}

		if(this.keyword == "免费"){
			window.location.hash = "#main/free";
			return;
		}

		this.isLoading = true;
		$.ajax({
			url:window.ebookweb.config.api_host+"search",
			method:"get",
			data:{
				page:this.curpage,
				keyword:this.keyword
			},
			dataType:"json",
			context:this
		}).always(function(result){
			console.log("search:",result);
			this.gotSearchResult = true;//是否获取到搜索结果

			this.isLoading = false;

			this.$(".list ul").html("");//清空

			if(result.data)
			{
				this.$(".result").show();

				if(result.count>0)
				{
					//有结果
					this.$(".not-found").hide();
					this.$(".list").show();
					this.$(".page-control").show();
					this.$(".page-control .prev").attr("disabled",this.curpage<=1);
					this.$(".page-control .next").attr("disabled",(result.data.length<this.lastpagesize || result.data.length>=result.count));

					this.$(".list .book-count").html(result.count);

					this.lastpagesize = result.data.length;

					//加上
					this.$(".list ul").html("");//清空
					_.each(result.data,function(item,index){
						//转换下数字
						item["readCountFormated"] = window.ebookweb.utils.Calculator.fixedCount(item["readCount"]);
						item["wordCountFormated"] = window.ebookweb.utils.Calculator.fixedCount(item["wordCount"]);

						var data = new window.ebookweb.models.BookItem({stat_p5:"5",data:item});
						var itemView = new window.ebookweb.views.components.BookListItemView({
							model:data
						});

						this.$(".list ul").append(itemView.render().el);
					},this);

					//隐藏历史记录
					this.historyItem.hide();

					//加上小编懂你
					if(!this.xiaobian)
					{
						var data = new window.ebookweb.models.ItemViewModel({stat_p5:"5",data:window.ebookweb.data.GlobalData["main"]["xiaobian"]});
						this.xiaobian = new window.ebookweb.views.components.XiaoBianItemView({model:data});

						this.$el.append(this.xiaobian.render().el);
					}

					// this.xiaobian.show();

					ka('info', 'p4=1&p5=10&p6=1&p7=' + this.keyword);//统计-有结果
				}
				else
				{
					this.$(".not-found").show();
					this.$(".list").hide();
					this.$(".page-control").hide();

					ka('info', 'p4=1&p5=10&p6=2&p7=' + this.keyword);//统计-无结果
				}

				$(window).scrollTop(0);
			}
			else
			{
				alert(result.msg || "服务器错误");
			}
		});
	}
});