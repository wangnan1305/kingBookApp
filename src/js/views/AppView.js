//主视图
window.ebookweb.views.AppView = Backbone.View.extend({
	el:"html",
	events:{
		"click window":"onBodyClick",
		"click .top-bar .music":"soundButtonHandler",
		"click .bottom-bar .arrow":"nextPage"
	},
	initialize:function(){
		//初始化
		window.ebookweb.mediator.on(window.ebookweb.events.CHANGE_MAIN_PAGE_TAB_EVENT,this.changeMainTabPageById,this);
		window.ebookweb.mediator.on(window.ebookweb.events.GO_TO_MAIN_PAGE_EVENT,this.goToMainPage,this);
		window.ebookweb.mediator.on(window.ebookweb.events.POPUP_PAGE_EVENT,this.onPopupPage,this);
		window.ebookweb.mediator.on(window.ebookweb.events.REMOVE_PAGE_EVENT,this.onRemovePage,this);

		this.container = this.$("body");//主页面容器

		this.pages = [];

		//禁止刷新
		if(window.read && window.read.JSSetSwipeRefreshEnabled) window.read.JSSetSwipeRefreshEnabled(false);

		//勿删，需要根据cookie中EBID查询用户对应最近阅读记录
		if (window.read && window.read.jsGetDeviceInfo) {
			this.info = JSON.parse(window.read.jsGetDeviceInfo());
			document.cookie = 'EBID=' + this.info.uid + ";path=/";
		}

		//loading加载页面
		this.curview = new window.ebookweb.views.pages.LoadingPageView({model:new window.ebookweb.models.PageViewModel({data:null})});
		this.container.append(this.curview.render().el);

		this.pages.push(this.curview);
	},
	onBodyClick:function(){

	},
	goToMainPage:function(){
		//去主页
		console.log("去主页");
		var self = this;
		if(this.curview != this.mainview)
		{
			if(!this.mainview)
			{
				this.mainview = new window.ebookweb.views.pages.MainPageView({model:new window.ebookweb.models.PageViewModel({data:null})});
				this.mainview.render(function(result){
					console.log("主页面回调");

					if(!_.isEmpty(result) && result["emphasis"])
					{
						self.curview.remove();//上一页面移除
						self.container.append(self.mainview.el);
						self.mainview.show();

						self.curview = self.mainview;
					}
					else
					{
						//显示错误提示
						console.log("网络异常");
						self.curview.$("p").html('<span style="color:#c4c4c4;font-size:0.45rem">网络异常<br>稍后再试</span>');
					}
				});
			}
			else
			{
				this.curview.destroy();//上一页面移除
				this.container.append(this.mainview.render().el);
				this.mainview.show();
				this.mainview.delegateEvents(this.mainview.events);//重新绑定事件

				this.curview = this.mainview;
			}
		}
	},
	changeMainTabPageById:function(tab){
		//修改主页的标签页面
		console.log("changeMainTabPageById:",tab);
		if(!this.mainview)
		{
			var self = this;
			this.mainview = new window.ebookweb.views.pages.MainPageView({model:new window.ebookweb.models.PageViewModel({data:null})});
			this.mainview.render(function(result){
				if(!_.isEmpty(result) && result["emphasis"])
				{
					if(self.curview) self.curview.remove();//上一页面移除
					self.container.append(self.mainview.el);
					self.mainview.show();

					self.curview = self.mainview;

					window.ebookweb.mediator.trigger(window.ebookweb.events.CHANGE_MAIN_PAGE_TAB_EVENT,tab);
				}
				else
				{
					//显示错误提示
					console.log("网络异常");
					self.curview.$("p").html("网络或数据接口异常");
				}
			});
		}
		else
		{
			if(this.curview == this.mainview) return;
			if(this.curview) this.curview.remove();//上一页面移除
			
			this.container.append(this.mainview.el);
			this.mainview.show();
			this.curview = this.mainview;

			// mediator.trigger(CHANGE_MAIN_PAGE_TAB_EVENT,tab);
		}
	},
	onPopupPage:function(page){
		//弹出一个新页面
		this.curview.destroy();//上一页面移除

		this.curview = page;
		this.container.append(this.curview.render().el);
		page.show();
	},
	onRemovePage:function(page){
		//删除一个页面
	}
});