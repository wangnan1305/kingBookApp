//书籍目录页面
window.ebookweb.views.pages.BookCatalogPageView = window.ebookweb.views.PageBaseView.extend({
	id:"book_catalog",
	className:"main-container book-detail-page",
	template:_.template($("#book_catalog_page_template").html()),
	events:{
		//事件
		"click .n-right .read a":"onOrderTypeClick",
		"click .l-title .partition":"onSelectPagerPop",
		"click .chapter .c-cont ul li a":"onSelectedPage",
		"click .l-cont ul div a":"onChapterLinkClick"
	},
	initialize:function(){
		//初始化
		this.model.set({reverse:0,page:1,pagesize:100});
		this.listenTo(this.model,"change",this.redraw);

		this.page = 1;
		this.pagesize = 100;

		this.tag = 1;
		//免费章节数默认30
		this.freeChapter = 30;

		//书籍目录页访问埋点
		ka(
			'info',
			'p4=1&p5=57'
		);
	},
	render:function(){
		//渲染
		this.redraw();

		this.getCatalog();

		return this;
	},
	destroy:function(){
		$('html').removeClass("htmlhidden")
		this.remove();
	},
	redraw:function(){
		//重新绘制
		this.$el.html(this.template(this.model.toJSON()));

		this.pager = this.$(".chapter");
		this.pager.hide();

		this.delegateEvents(this.events);
	},
	getCatalog:function(){
		//获取目录
		var _this = this;
        $('html').removeClass("htmlhidden")
		$.ajax({
			url:window.ebookweb.config.api_host+"book/chapter-list",
			method:"get",
			data:{
				bookid:this.model.get("bookid"),
				page:this.page,
				pagesize:this.pagesize,
				reverse:this.model.get("reverse")
			},
			dataType:"json",
			context:this
		}).always(function(result){
			
			//this.handleData这个方法处理后端数据，以后会删掉
			//this.handleData(result);

			console.log("书籍目录结果:",result);

			if(result.code == 200&&result.data&&result.data.length>0)
			{
				var totalpage = parseInt(result.totalsize/this.pagesize);
				var totalpage_reserve = Math.floor(result.totalsize/this.pagesize);
				if(result.totalsize%this.pagesize!=0) totalpage++;

				var data = result["data"];
				if(!_this.model.get('reverse')){
					var pagerLabel = ((this.page-1)*this.pagesize+1)+"-";
					pagerLabel+=(this.page*this.pagesize>result.totalsize ?result.totalsize:this.page*this.pagesize)+"章";
				}else{

					var pagerLabel = (result.totalsize-(this.page-1)*this.pagesize) + '-';
					pagerLabel += (this.page*this.pagesize)>result.totalsize ? "01章" : (result.totalsize-(this.page)*this.pagesize+1)+"章";

				}

				this.model.set({
					data:data,
					pagerLabel:pagerLabel,
					totalsize:result.totalsize,
					totalpage:totalpage
				});
			}
			else
			{
				// alert(result.msg || "服务器错误");
			}
		});
	},
	//处理后端数据，这个方法以后会删
	handleData:function(result){
		if(result.code == 200&&result.data&&result.data.length>0){
			//遍历对象
			result.data.forEach(function(item,index){
				if(parseInt(item["chapterSeq"]) > 29){
					item["feeStatus"] = "2"
				}
			})
		}else{
			console.log(result.msg || "服务器错误")
		}
	},
	onOrderTypeClick:function(e){
		//排序
		this.page = 1;
		this.tag = 1;

		var reverse = parseInt($(e.currentTarget).data("reverse"));
		this.model.set({reverse:reverse});
		this.getCatalog();
	},
	onSelectPagerPop:function(e){
		//选择章节pop
		var _this = this;
		var bg_list = document.querySelector(".list .close");

		this.pager.show();

		window.ebookweb.utils.Event.addEvent(bg_list,"touchmove",function (e) {
			window.ebookweb.utils.Event.preventDefault(e);
		});
		$('html').addClass("htmlhidden")
		if(this.tag){
			this.$('.close').click(function(){
				console.log('隐藏'+_this.tag)
				_this.pager.hide();
				_this.tag = 0;
				$('html').removeClass("htmlhidden")
				window.ebookweb.utils.Event.removeEvent(bg_list,"touchmove")
			})
		}else{
			console.log('显示'+this.tag)
			this.pager.show();
			this.tag = 1;
			$('html').addClass("htmlhidden")
			window.ebookweb.utils.Event.addEvent(bg_list,"touchmove",function (e) {
				window.ebookweb.utils.Event.preventDefault(e);
			})
		}
	},
	onSelectedPage:function(e){
		//选择了页码
		console.log("选择页码");
		this.pager.hide();

		var page = $(e.currentTarget).data("page");
		this.page = page;
		this.getCatalog();
	},
	onChapterLinkClick:function(e){
		var url = $(e.currentTarget).attr("href");
		return window.ebookweb.utils.openBookWeb(url,"webview");
	}
});