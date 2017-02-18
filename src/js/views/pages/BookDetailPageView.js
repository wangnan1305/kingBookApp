//书籍详情页面
window.ebookweb.views.pages.BookDetailPageView = window.ebookweb.views.PageBaseView.extend({
	id:"book_detail",
	className:"main-container book-detail-page",
	template:_.template($("#book_detail_page_template").html()),
	events:{
		//事件
		"click .nav-bar .left a":"clickHistoryJudge",
		"click #reader_books_section .common-go a":"changeReadersBooks",
		"click .book-detail-console-footer .layer .l-read":"sendToDesk",
		"click .i-btns .i-send":"sendToDesk",
		"click .book-detail-console-footer .layer .l-send a":"startRead",
		"click .i-btns .i-read a":"startRead",
		"click .info .i-cont .i-syno":"switchDescription",
		"click .info .i-cont .i-syno.open .arrow":"switchDescription",
		"click .info .i-cont .i-syno.close .arrow":"switchDescription",
		"click .info .i-list p a":"onChapterLinkClick"
	},
	initialize:function(){
		//初始化
		this.listenTo(this.model,"change",this.checkDataAreloaded);
		this.tagicon = false;
		this.version = JSON.parse(window.splash.jsGetDeviceInfo())['app_version'];

		//判断是不是9.9以上或以下版本，赋值一个全局变量，下面好几处都要用到
		this.versionJudge = this.checkoutVersion(this.version);  //布尔值 true9.9+ false9.9-
		//书籍详情页访问埋点
		ka(
			'info',
			'p4=1&p5=56'
		);
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));

		this.handlestartRead(this.version);

		console.log("渲染书籍详情:",this.model.toJSON());

		//底部操作栏
		this.consoleFooter = this.$(".book-detail-console-footer");
		this.consoleFooter.hide();

		var self = this;
		setTimeout(function(){
			$(window).on("scroll",self.onWindowScroll.bind(self));
		},500);

		this.getBookDetail();//获取书籍详情
		// this.getBookCatalog();//获取目录
		// this.getAuthorBooks();//获取作者写的过的书籍

		//控制显示隐藏
		if(this.$(".info .i-cont .i-syno").length>0)
		{
			var line_h = parseInt(this.$(".info .i-cont .i-syno").css("line-height"));
			var h = this.$(".info .i-cont .i-syno").height();
			if(h>line_h*3)
			{
				this.$(".info .i-cont .i-syno").addClass("open");	
			}else{
				//小于两行执行，让这个icon永远不显示，在switchDescription里面
				this.tagicon = true;
			}

			this.delegateEvents(this.events);
		}

		// console.log("描述dom高度:",parseInt(this.$(".info .i-cont .i-syno").css("line-height")),this.$(".info .i-cont .i-syno").height());

		return this;
	},
	//处理发送至桌面样式，9.9和9.9以下样式分开处理
	handlestartRead:function(){
		
		if(this.versionJudge){
			//9.9以上版本
			this.$("div.i-send").show();
			
		}else{
			//9.9以下
			console.log("9.9以下")
			this.$("div.i-send").hide();
			this.$("div.i-read").css({
				"marginLeft":0,
				"width":"100%"
			});
			this.$("div.i-read a").css({
				"width":"100%"
			});

			this.$(".footer").css({
				"height":"1.37rem"
			})
		}
	},
	//处理添加到桌面的返回
	clickHistoryJudge:function(e){

		if(window.history.length <= 1){
			window.ebookweb.utils.Event.preventDefault(e);
			
			if(window.splash) 
			{
				window.splash.onBackPressed(true);//退出当前webview
			};
		}
	},
	destroy:function(){
		console.log("移除详情页面");
		$(window).off("scroll");
		this.remove();
	},
	checkDataAreloaded:function(){
		console.log(":::::::"+this.model.get("catalog"))
			//console.log(this.model.get("data")+"::::"+this.model.get("authorBooks")+":::"+this.model.get("catalog")+":::"+this.model.get("readerBooks"))
			if(this.model.get("data") && this.model.get("authorBooks") && this.model.get("catalog") && this.model.get("readerBooks"))
			{
					this.render();
			}
	},
	switchDescription:function(){
		//展开或者关闭描述
		//小于两行执行
		if(this.tagicon){return false;}

		if(!this.isDescOpen)
		{
			this.isDescOpen = true;
			this.$(".info .i-cont .i-syno").removeClass("open");
			this.$(".info .i-cont .i-syno").addClass("close");
			console.log('close')
			this.delegateEvents(this.events);
		}
		else
		{
			this.isDescOpen = false;
			this.$(".info .i-cont .i-syno").removeClass("close");
			this.$(".info .i-cont .i-syno").addClass("open");
			console.log('open')
			this.delegateEvents(this.events);
		}
	},
	onWindowScroll:function(e){
		// console.log("book detail scroll:",$(window).scrollTop(),this.$(".i-btns").position().top,this.$(".i-btns").height());
		if($(window).scrollTop()>this.$(".i-btns").position().top+this.$(".i-btns").height())
		{
			if(this.versionJudge){
				this.consoleFooter.show();
			}else{
				this.consoleFooter.hide();
			}
		}
		else
		{
			this.consoleFooter.hide();
		}
	},
	getBookDetail:function()
	{
		//获取书籍详情
		if(!this.model.get("data"))
		{
			//获取书籍详情
			$.ajax({
				url:window.ebookweb.config.api_host+"book/detail",
				method:"get",
				data:{
					bookid:this.model.get("bookid")
				},
				dataType:"json",
				context:this
			}).always(function(result){
				console.log("书籍详情结果:",result);

				if(result.code == 200&&result.data&&result.data.length>0)
				{
					var data = result["data"][0];
					data["wordCountFormated"] = window.ebookweb.utils.Calculator.fixedCount(data["wordCount"]);
					this.model.set({data:data,title:data["title"]});

					this.getBookCatalog();//获取目录
					this.getAuthorBooks();//获取作者写的过的书籍

					this.getReaderBooks();//获取书友读过的书籍
				}
				else
				{
					this.model.set({data:[]});
					alert(result.msg || "服务器错误");
				}
			});
		}
	},
	getBookCatalog:function(){
		//获取书籍目录
		if(!this.model.get("catalog"))
		{
			$.ajax({
				url:window.ebookweb.config.api_host+"book/chapter-list",
				method:"get",
				data:{
					bookid:this.model.get("bookid"),
					page:1,
					pagesize:2,
					reverse:0
				},
				dataType:"json",
				context:this
			}).always(function(result){
				console.log("书籍目录结果:",result);

				if(result.code == 200&&result.data&&result.data.length>0)
				{
					var data = result["data"];
					var catalog = {
						totalsize:result["totalsize"],
						list:data
					};

					//设置开始阅读url,直接从第一章的数据里获取
					console.log("书籍目录结果:",data);
					this.model.get("data")["url"] = data[0]["url"];

					this.getBookLastCatalog(catalog);
				}
				else
				{
					// alert(result.msg || "服务器错误");
				}
			});
		}
	},
	getBookLastCatalog:function(catalog){
		//获取书籍最后章节
		if(!this.model.get("catalog"))
		{
			$.ajax({
				url:window.ebookweb.config.api_host+"book/chapter-list",
				method:"get",
				data:{
					bookid:this.model.get("bookid"),
					page:1,
					pagesize:1,
					reverse:1
				},
				dataType:"json",
				context:this
			}).always(function(result){
				console.log("书籍最后目录结果:",result);

				if(result.code == 200&&result.data&&result.data.length>0)
				{
					var data = result["data"][0];
					var date = new Date();
					// data["updateTime"] = "20160128213439";
					if(data["updateTime"]&&data["updateTime"].length>=14)
					{
						//转换时间
						date.setFullYear(parseInt(data["updateTime"].substr(0,4)));
						date.setMonth(parseInt(data["updateTime"].substr(4,2))-1);
						date.setDate(parseInt(data["updateTime"].substr(6,2)));
						date.setHours(parseInt(data["updateTime"].substr(8,2)));
						date.setMinutes(parseInt(data["updateTime"].substr(10,2)));
						date.setSeconds(parseInt(data["updateTime"].substr(12,2)));
					}
					var times = (new Date().getTime()-date.getTime())/1000/60/60/24;
					console.log(times)
					if(times < 31){
						data["updateTimeAgo"] = window.ebookweb.utils.Calculator.getDateDiff(date.getTime());
						catalog["lastChapter"] = data;
						
					}
					this.model.set({catalog:catalog});
					this.checkDataAreloaded();
				}
				else
				{
					this.model.set({catalog:[]});
					alert(result.msg || "服务器错误");
				}
			});
		}
	},
	getAuthorBooks:function()
	{
		console.log("getAuthorBooks:",this.model.get("data")["authorId"]);
		//获取作者写过的书籍
		if(!this.model.get("authorBooks"))
		{
			$.ajax({
				url:window.ebookweb.config.api_host+"book/books-by-author",
				method:"get",
				data:{
					authorid:this.model.get("data")["authorId"] || "10669744",
					except:this.model.get("data")["bookid"],
					page:1,
					pagesize:3
				},
				dataType:"json",
				context:this
			}).always(function(result){
				console.log("作者写过的书籍结果:",result);

				if(result.code == 200&&result.data&&result.data.length>0)
				{
					var data = result["data"];
					this.model.set({authorBooks:data,authorBooksTotalSize:result["totalsize"]});
				}
				else
				{
					// alert(result.msg || "服务器错误");
					this.model.set({authorBooks:[],authorBooksTotalSize:0});
				}
			});
		}
	},
	getReaderBooks:function()
	{
		//获取书友还读过的书籍
		$.ajax({
			url:window.ebookweb.config.api_host+"book/similar-books",
			method:"get",
			data:{
				cateid:this.model.get("data")["cateId"],
				page:1,
				pagesize:3
			},
			dataType:"json",
			context:this
		}).always(function(result){
			console.log("书友还读过的书籍:",result);

			if(result.code == 200&&result.data&&result.data.length>0)
			{
				var data = result["data"];
				if(!this.model.get("readerBooks"))
				{
					this.model.set({readerBooks:data});
				}
				else
				{
					//换一换
					this.$("#reader_books_section .r-list ul").html("");//清空
					_.each(data,function(item,index){
						var itemView = _.template($("#book_detail_page_book_figure_item_template").html())(item);
						
						this.$("#reader_books_section .r-list ul").append(itemView);
					},this);
				}
			}
			else
			{
				this.model.set({readerBooks:[]});
				// alert(result.msg || "服务器错误");
			}
		});
	},
	changeReadersBooks:function(){
		//换一换
		console.log("换一换");
		this.getReaderBooks();
	},
	sendToDesk:function(){
		//发送到桌面
		console.log("发送到桌面:",this.model.get("data"));
		console.log(window.splash + "这个有没有")
		if(window.splash)
		{
			var data = this.model.get("data");
			var json = window.read.jsGetDeviceInfo();
			var json_version = JSON.parse(json)['app_version'];

			if(this.versionJudge){
				
				//9.9以上版本
				window.splash.installShortCut(data["title"],encodeURI(data["imgUrl"]),window.location.href,"readwebview");
				window.read.JSShowToast("添加成功")
			}else{
				// 9.9以下 不做处理
				// window.splash.installShortCut(data["title"],encodeURI(data["imgUrl"]),window.location.href,"webview");
			  // window.read.JSShowToast("添加成功")
			}
			
		}
	},

	checkoutVersion:function(str,fixstr){
		if(!str) {
			alert('请输入参数');
			return;
		}
		if(!fixstr) fixstr = "9.9.0";

		var strA = str.split("."),
				fixstrA = fixstr.split(".");

		if(strA[0] < fixstrA[0]){
			return false;
		}

		if(strA[1] < fixstrA[1]){
			return false;
		}

		if((strA[2] ? strA[2] : 0) >= (fixstrA[2] ? fixstrA[2] : 0)){
			return true;
		}else{
			return false;
		}
	},

	startRead:function(e){
		//开始阅读
		var p6 = $(e.currentTarget).data("p6");

		console.log("开始阅读点击监测",p6,$(e.currentTarget));

		ka(
			'info',
			'p4=2&p5=45&p6='+p6
		);

		var url = $(e.currentTarget).attr("href");
		return window.ebookweb.utils.openBookWeb(url,"webview");
	},
	onChapterLinkClick:function(e){
		var url = $(e.currentTarget).attr("href");
		return window.ebookweb.utils.openBookWeb(url,"webview");
	}
});