//首页视图
window.ebookweb.views.pages.MainPageView = window.ebookweb.views.PageBaseView.extend({
	id:"main",
	className:"main-container for-sub-tab",
	template:_.template($("#main_page_template").html()),
	events:{
		//事件
		"click .nav-bar .left .back":"onBackClick",
		"click .nav-tabbar ul li":"onNavClick",//导航点击
		"click .nav-bar .search":"onSearchLinkClick",//搜索
		"click .nav-bar .last-read":"onLastReadLinkClick"//最近阅读
	},
	initialize:function(){
		//初始化
		window.ebookweb.mediator.on(window.ebookweb.events.CHANGE_MAIN_PAGE_TAB_EVENT,this.changeTabPageById,this);

		this.currentTabPage = "favorite";//当前是精选页面
		this.views = [];
	},
	render:function(callback){
		//渲染
		this.$el.html(this.template());
		this.container = this.$("#favorite");
		this.rankContainer = this.$("#ranking");
		this.classesContainer = this.$("#class");
		this.freeContainer = this.$("#free");

		//最近阅读
		this.lastestReadItemView = this.drawView("lastread",{title:"获取中..."});

		if(!this.model.get("data"))
		{
			//获取数据
			$.ajax({
				url:window.ebookweb.config.api_host+"index",
				method:"get",
				data:null,
				dataType:"json",
				context:this
			}).always(function(result){
				//结果,目前返回是一个数据对象,之后加上错误码判断
				if(!_.isEmpty(result) && result["emphasis"])
				{
					this.model.set("data",result);
					this.renderItems();
					this.renderLastestReadItem();

					//精选页面
					ka(
						'info',
						'p4=1&p5=1'
					);

					this.delegateEvents(this.events);//事件需要重新绑定
				}
				else
				{
					//显示错误页面
					console.log("获取数据错误",callback);
				}

				if(callback) callback(result);
			});
		}
		else
		{
			//已经获取过,直接渲染
			var tabId = this.currentTabPage//当前是精选页面
			this.currentTabPage = null;

			this.$("section").hide();
			
			this.changeTabPageById(tabId);
			this.renderItems();
			this.renderLastestReadItem();

			this.delegateEvents(this.events);//事件需要重新绑定

			if(callback) callback();
		}

		return this;
	},
	show:function(){
		//显示
		_.each(this.views,function(item,index){
			//重新绑定所有组件事件
			if(item.events) item.delegateEvents(item.events);
		},this);
	},
	renderLastestReadItem:function(){
		//渲染最近阅读
		var result = this.model.get("lastestRead");
		if(!_.isEmpty(result) && result["bookmarkList"] && result["bookmarkList"].length>0)
		{
			this.lastestReadItemView.model.set({data:this.model.get("lastestRead")["bookmarkList"][0]});
			this.lastestReadItemView.$el.css("display","block");
		}
		else
		{
			//获取最近阅读
			$.ajax({
				url:window.ebookweb.config.api_host+"book/recent-read",
				method:"get",
				data:null,
				dataType:"json",
				context:this
			}).always(function(result){
				//结果,目前返回是一个数据对象,之后加上错误码判断
				console.log("最近阅读:",result);
				// if(result.length<=0) result = lastestRead;

				// result = {
				// 	"bookmarkList":[{
				// 		title:"标题",
				// 		url:"http://www.baidu.com"
				// 	}]
				// };

				if(!_.isEmpty(result) && result["bookmarkList"] && result["bookmarkList"].length>0)
				{
					console.log("result:",result);
					
					this.lastestReadItemView.model.set({data:result["bookmarkList"][0]});
					this.lastestReadItemView.$el.css("display","block");
				}
				else
				{
					console.log("没有最近阅读");
				}

				this.model.set("lastestRead",result);
			});
		}
	},
	renderItems:function(){
		var result = this.model.get("data");

		console.log(result);
		if(!_.isEmpty(result) && result["emphasis"])
		{

			window.ebookweb.data.GlobalData["main"] = result;

			this.drawView("emphasis",result["emphasis"]);//重磅推荐
			this.drawView("navs",result["navs"]);//大分类
			this.drawView("xiaobian",result["xiaobian"]);//小编懂你
			this.drawView("man",result["men"]);//男生爱看
			this.drawView("women",result["women"]);//女生爱看
			this.drawView("hotBook",result["hotBook"]);//热搜榜
			this.drawView("newBook",result["newBook"]);//新书首发
			this.drawView("entrances",result["recommend"]);//分类导航
			this.drawView("footer",null);//底部

			//排行榜
			this.drawView("rank",result["rank"]);

			//分类
			this.drawView("classes",result["classes"]);

			//免费
			this.drawView("free",null);//底部
		}
		else
		{
			// alert(result.msg || "服务器数据错误");
		}
	},
	drawView:function(type,data){
		//根据类型绘制视图
		var itemView,model;
		switch(type)
		{
			case "lastread"://最近阅读
				model = new window.ebookweb.models.ItemViewModel({type:type,data:data});
				itemView = new window.ebookweb.views.components.LastReadItemView({model:model});
				this.container.append(itemView.render().el);
			break;
			case "emphasis"://重磅推荐
				model = new window.ebookweb.models.ItemViewModel({type:type,data:data});
				itemView = new window.ebookweb.views.components.RecommendsItemView({model:model});
				this.container.append(itemView.render().el);
			break;
			case "navs"://大分类
				model = new window.ebookweb.models.ItemViewModel({type:type,data:data});
				itemView = new window.ebookweb.views.components.NavsItemView({model:model});
				this.container.append(itemView.render().el);
			break;
			case "xiaobian"://小编懂你
				model = new window.ebookweb.models.ItemViewModel({type:type,data:data});
				itemView = new window.ebookweb.views.components.XiaoBianItemView({model:model});
				this.container.append(itemView.render().el);
			break;
			case "man"://男生爱看
				model = new window.ebookweb.models.ItemViewModel({type:type,data:data});
				itemView = new window.ebookweb.views.components.ManItemView({model:model});
				this.container.append(itemView.render().el);
			break;
			case "women"://女生爱看
				model = new window.ebookweb.models.ItemViewModel({type:type,data:data});
				itemView = new window.ebookweb.views.components.WomenItemView({model:model});
				this.container.append(itemView.render().el);
			break;
			case "hotBook"://热搜榜
				model = new window.ebookweb.models.ItemViewModel({type:type,data:data});
				itemView = new window.ebookweb.views.components.HotBookItemView({model:model});
				this.container.append(itemView.render().el);
			break;
			case "newBook"://新书首发
				model = new window.ebookweb.models.ItemViewModel({type:type,data:data});
				itemView = new window.ebookweb.views.components.NewBookItemView({model:model});
				this.container.append(itemView.render().el);
			break;
			case "entrances"://分类导航
				model = new window.ebookweb.models.ItemViewModel({type:type,data:data});
				itemView = new window.ebookweb.views.components.EntrancesItemView({model:model});
				this.container.append(itemView.render().el);
			break;
			case "footer"://底部
				model = new window.ebookweb.models.ItemViewModel({type:type,data:data});
				itemView = new window.ebookweb.views.components.FooterItemView({model:model});
				this.container.append(itemView.render().el);
			break;
			case "rank"://排行榜
				model = new window.ebookweb.models.ItemViewModel({type:type,data:data});
				itemView = new window.ebookweb.views.components.RankItemView({model:model});
				this.rankContainer.append(itemView.render().el);
			break;
			case "classes"://分类标签页面
				model = new window.ebookweb.models.ItemViewModel({type:type,data:data});
				itemView = new window.ebookweb.views.components.ClassesItemView({model:model});
				this.classesContainer.append(itemView.render().el);
			break;
			case "free"://免费标签页面
				model = new window.ebookweb.models.ItemViewModel({type:type,data:data});
				itemView = new window.ebookweb.views.components.FreeItemView({model:model});
				this.freeContainer.append(itemView.render().el);
			break;
		}

		this.views.push(itemView);

		return itemView;
	},
	onBackClick:function(e){
		console.log("点击首页返回,退出webview");
		if(window.splash && window.splash.onBackPressed) 
		{
			window.splash.onBackPressed(true);//退出当前webview

			return false;
		}
		else
		{
			window.history.back();
			return true;
		}
	},
	onNavClick:function(e){
		//tab导航点击
		var target = $(e.currentTarget).data("target");
		console.log("target:",target);

		this.changeTabPageById(target);
	},
	onSearchLinkClick:function(){
		//搜索点击
		console.log("点击搜索");
		ka(
			'info',
			'p4=2&p5=1&p6=2'
		);

		return true;
	},
	onLastReadLinkClick:function(){
		//最近阅读点击
		console.log("点击最近阅读");
		ka(
			'info',
			'p4=2&p5=1&p6=1'
		);

		return true;
	},
	changeTabPageById:function(id)
	{
		//根据
		if(this.currentTabPage != id)
		{
			//不是当前页面,可以切换
			this.$("#"+this.currentTabPage).hide();

			this.currentTabPage = id;

			this.$("#"+this.currentTabPage).show();

			//改变导航状态
			this.$(".nav-tabbar.top li").removeClass();
			this.$("#"+this.currentTabPage+"_tab_link").addClass("active");

			//访问埋点
			var tab_stats = {"favorite":1,"ranking":12,"class":31,"free":59};
			ka(
				'info',
				'p4=1&p5='+tab_stats[id]
			);
		}

		$(window).scrollTop(0);
	}
});