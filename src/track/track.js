
/**	注入书城页面的js
*	http://dl.mo.cache.wps.cn/mobile/android/reader/track.js
*/

// if(!window.splash) window.splash = {};

// window.splash["isInReadingHistory"] = function(bookid){
// 		return false;
// 	};

// window.splash["putReadingToHistory"] = function(){};

jQuery.noConflict();

(function(params){
	//详情页面操作
	console.log("init track 3.34");

	// alert(17);
	// if(window.added_track) return;
	// alert(11);
	window.added_track = true;

	var wps_hash = "#wps_read";//我们注入的锚点
	var add_dialog_count= 0;//弹出的次数 

	//解析search字符串
	var query = {};
	if(window.location.search && window.location.search.length>1)
	{
		var arr = window.location.search.substring(1).split("&");
		for(var i = 0;i<arr.length;i++)
		{
			var arr2 = arr[i].split("=");
			query[arr2[0]] = arr2[1];
		}
	}

	console.log("query:",query);

	var url = window.location.href+"";

	//禁止刷新
	if(window.splash && window.splash.JSSetSwipeRefreshEnabled) window.splash.JSSetSwipeRefreshEnabled(false);

	//修改url的参数
	function changeURLArg(url,arg,arg_val)
	{
		var pattern=arg+'=([^&]*)'; 
		var replaceText=arg+'='+arg_val; 
		if(url.match(pattern))
		{
			var tmp='/('+ arg+'=)([^&]*)/gi'; 
			tmp=url.replace(eval(tmp),replaceText);

			return tmp; 
		}
		else
		{
			if(url.match('[\?]'))
			{
				return url+'&'+replaceText; 
			}
			else
			{
				return url+'?'+replaceText; 
			}
		}

		return url+'\n'+arg+'\n'+arg_val; 
	}

	//生成保存到wps首页的url
	function buildWPSDeskBookURL()
	{
		var new_url = changeURLArg(changeURLArg(url,"page",page),"from_wps_desk","yes");

		return new_url;
	}

	//创建底部确认对话框
	function buildConfirmDialog(title,msg,jump_url,callback)
	{
		window.onWPSAddToIndexOptionSelected = function(ok){
			$("#wps_read_confirm_dialog").remove();
			return callback(ok);
		};

		var html_str = '<div id="wps_read_confirm_dialog_bg" style="background-color:#000000;position:absolute;left:0;top:'+$(window).scrollTop()+'px;right:0;bottom:0;width:100%;height:100%;opacity:0.3;z-index:99999999999999999998;"><a style="display:block;width:100%;height:100%"></a></div>';//背景遮罩
		html_str +='<div id="wps_read_confirm_dialog" style="background-color:#ffffff;position:fixed;z-index:99999999999999999999;left:0;bottom:0;right:0;height:140px">';//主容器
		html_str+='<div style="position:relative;width:100%;height:100%">';//内容容器

		html_str+='<p style="margin:15px;color:#b8b8b8;font-size:14px">'+title+'</p>';//标题
		html_str+='<p style="margin:15px;color:#434343;font-size:19px">'+msg+'</p>';//内容

		html_str+='<div style="position:absolute;left:0;right:0;bottom:0;height:60px">';//底部按钮
		html_str+='<a onclick="return onWPSAddToIndexOptionSelected(0)" href="'+jump_url+'" style=";border-top:solid 1px #e9e9e9;line-height:50px;display:inline-block;width:50%;height:60px;text-align:center;color:#434343;font-size:17px;-webkit-tap-highlight-color: rgba(189,189,189,.5)">取消</a>';//取消按钮
		html_str+='<a onclick="return onWPSAddToIndexOptionSelected(1)" href="'+jump_url+'" style=";border-top:solid 1px #12bfc3;line-height:50px;background-color:#12bfc3;display:inline-block;width:50%;height:60px;text-align:center;color:#ffffff;font-size:17px;-webkit-tap-highlight-color: rgba(189,189,189,.5)">确定</a>';//确定按钮
		html_str+='</div>';//底部按钮结束

		html_str+='</div>';//底部按钮结束
		html_str+='</div>';//内容容器结束
		html_str+='</div>';//主容器结束

		$("body").append(html_str);
		$("body").css("overflow","hidden");
		// $(window).css("overflow-y","hidden");

		var touch_func = function (event) 
		{
		    event.preventDefault();
		};

		document.body.addEventListener('touchmove', touch_func, false);

		$("#wps_read_confirm_dialog_bg a").on("click",function(e){
			$("#wps_read_confirm_dialog_bg").remove();
			$("#wps_read_confirm_dialog").remove();

			$("body").css("overflow","scroll");
			// $(window).css("overflow-y","scroll");

			var top = $(window).scrollTop();
			console.log("top 1:"+top);
			window.location.hash = wps_hash;
			// $(window).scrollTop(top);//滚回到以前位置

			document.body.removeEventListener('touchmove', touch_func);

			// console.log("top 2:"+top+","+$(window).scrollTop());
		});

		add_dialog_count++;
	}

	//关闭当前页面activity
	function closeWPSReaderPage()
	{
		if(window.splash && window.splash.onBackPressed)
		{
			window.splash.onBackPressed(true);//退出当前webview
			return false;
		}
		else
		{
			return true;
		}
	}

	// console.log("url:",url);
	// console.log("changed url:",changeURLArg(url,"page",20));

	if($(".rp_tool_top").length>0 && $(".rp_tool_bottom").length>0)
	{
		console.log("进入了书籍详情页面:rp_bookname=",$(".rp_bookname").html(),",chapterid=",$("#chapterid").val(),",bookid=",$("#bookid").val());
		var bookid = parseInt($("#bookid").val());
		var book_name = $(".rp_bookname").html();
		var chapterid = parseInt($("#chapterid").val());
		var chapter_name = $("#chapterName").val();
		var read_mode = parseInt($("#readmode").val());//阅读翻页方式,1上下,2左右
		var is_added = false;//是否添加了首页
		var is_changed_page_in_the_first = false;//是否在页面进来时候根据历史记录修改了分页
		var is_show_add_dialog = false;//是否已经添加了确认框

		//修改详情页链接，跳转到自定义详情页
		var base_url = 'http://book.rdtuijian.com/web/index.html';
		if ($('a.rp_link_home').length > 0) {
			$('a.rp_link_home').attr('href', base_url);
		}
		if ($('a.bname').length > 0) {
			$('a.bname').attr('href', base_url + '#book/detail/' + bookid + '/' + book_name);
		}

		//判断下是否添加到了首页
		if(window.splash)
		{
			var old_hash = window.location.hash+"";//旧的锚点
			var last_hash = wps_hash;

			$(window).on("hashchange",function(){
				console.log("hash:",old_hash,window.location.hash);

				// alert(window.location.hash);

				if(is_show_add_dialog && window.location.hash != "#book_detail_add" && window.location.hash != wps_hash)
				{
					console.log("弹出了,但是不是本身的hash,直接退出");
					window.splash.onBackPressed(true);//退出当前webview
					return;
				}

				if(window.location.hash == wps_hash || (window.location.hash == "#book_detail_add")&&add_dialog_count<=0) return;

				if(!is_added && window.splash.putReadingToHistory)
				{
					if(is_show_add_dialog) return;
					window.location.hash = "#book_detail_add";
					buildConfirmDialog("温馨提示","喜欢就加入WPS首页吧","http://wap.cmread.com/r/"+bookid+"/index.htm",function(ok){
						console.log("是否加入首页:",ok);

						if(ok)
						{
							//加入wps首页
							window.splash.putReadingToHistory(bookid,book_name,buildWPSDeskBookURL(),chapterid,chapter_name);
						}

						closeWPSReaderPage();

						return false;
					});

					is_show_add_dialog = true;
				}
				else
				{
					window.splash.onBackPressed(true);//退出当前webview
				}
			});

			window.location.hash = wps_hash;

			if(!window.splash.isInReadingHistory(bookid))
			{
				console.log("没有添加到首页:",bookid);

				is_added = false;
			}
			else
			{
				console.log("添加到了首页,进行更新处理:",bookid);
				is_added = true;
				
				var new_url = buildWPSDeskBookURL();
				window.splash.putReadingToHistory(bookid,book_name,new_url,chapterid,chapter_name);

				$(".rp_tool_top .rp_link_back").on("click",function(){
					console.log("点击返回");
					closeWPSReaderPage();
					return false;
				});
			}
		}	

		//翻页时候记录阅读记录
		addCookie("read_mode",read_mode,24*365);
		if(read_mode == 1)
		{
			//上下翻页
			console.log("上下分页,绑定unload事件");
			$(window).on("scroll",function(e){
				console.log("scroll top:",$(window).scrollTop());
				if(last_hash == wps_hash && window.location.hash == wps_hash) 
				{
					//只有在注入的hash锚点下才记录
					addCookie("readed_page_top_"+chapterid,$(window).scrollTop(),24*365);
				}
			});

			// alert("readed_page_top:"+getCookie("readed_page_top"));

			if(getCookie("readed_page_top_"+chapterid)&&!is_changed_page_in_the_first)
			{
				//滚动到指定位置
				is_changed_page_in_the_first = true;
				console.log("滚动到指定位置:",getCookie("readed_page_top_"+chapterid));
				$(window).scrollTop(getCookie("readed_page_top_"+chapterid));
			}
		}
		else if(read_mode == 2)
		{
			//左右翻页
			console.log("左右翻页");
			$(".rp_read .rp_head .rp_pageinfo").bind("DOMNodeInserted",function(e){
				console.log("页码发生了变化:",$(".rp_read .rp_head .rp_pageinfo").html());
			});

			//移花接木
			var totalPage2 = read.totalPage2;
			read.totalPage2 = function(){
				var winWidth = $(window).width();
        		var totalPage = Math.ceil(document.getElementById("read_text").scrollWidth / winWidth);//总页
        
				console.log("调用我们的翻页计算函数:"+page+"/"+totalPage);

				if(is_added)
				{
					//添加到了首页,更新下本地阅读记录
					var new_url = buildWPSDeskBookURL();
					window.splash.putReadingToHistory(bookid,book_name,new_url,chapterid,chapter_name);
				}

				addCookie("readed_page_"+chapterid,page,24*365);

				totalPage2();
			};

			if(getCookie("readed_page_"+chapterid) && !is_changed_page_in_the_first)
			{
				is_changed_page_in_the_first = true;
				page = getCookie("readed_page_"+chapterid);

				var totalPage = Math.ceil(document.getElementById("read_text").scrollWidth / winWidth);//总页
				if(page>=totalPage) page=totalPage-1;
				read.touchRight();
			}
		}
	}
	else
	{
		//作品详情页面
		$(".headbar .back").on("click",function(e){
			console.log("返回");
			// return false;
			return closeWPSReaderPage();
		});
	}

	// buildConfirmDialog("温馨提示","喜欢就加入WPS首页吧","#",null);
})();

window.ybloadzj = function(mySwiper, page, pd) {
    var dqindex = $("#chapterSort").attr("value");
    var chapterid = $("#chapterid").attr("value");
    var bookid = $("#bookid").attr("value");
    var url = "https://wap.cmread.com/r/p/ybzjdata.jsp?page=" + page + "&vt=3&bid=" + bookid + "&cid=" + chapterid;
    $.ajax({
        url: url,
        success: function(data) {
            var startidex = data.indexOf('<anyce>');
            var endindex = data.indexOf('</anyce>');
            var str = data.substring(startidex + 7, endindex);
            var arr = str.split(",");
            for (i = 0; i < arr.length; i++) {


                var dqpage = parseInt(dqindex / 20);
                if (dqindex % 20 == 0 && dqindex >= 20) {
                    var index = dqindex - 20 * (dqpage - 1);
                } else {
                    var index = dqindex - 20 * dqpage;
                }
                var str = arr[i];
                if (pd == 2) {
                    if (i == index - 1) {
                        str = str.replace('class="t"', 'class="curr"');
                    }
                }
                var newSlide = mySwiper.createSlide(str, 'swiper-slide', 'div');
                var slideNum = $(".swiper-slide").size();
                var sumpage = $("#sunpage").attr("value");
                var slpage = $("#slpage").attr("value");
                if (page > 1) {
                    mySwiper.insertSlideAfter(i, newSlide);
                    if (pd == 2) {
                        mySwiper.swipeTo(index - 1, 0, false);
                    }
                } else {
                    mySwiper.insertSlideAfter(i, newSlide);
                    if (pd == 2) {
                        mySwiper.swipeTo(index - 1, 0, false);
                    }
                }
            }
            if (pd == 2) {
                mySwiper.removeSlide(0);
            }
        }
    });
}

window.updownloadzj = function(mySwiper, page, pd) {

    if (move == 0) {
        move = 1;

        var dqindex = $("#chapterSort").attr("value");
        var chapterid = $("#chapterid").attr("value");
        var dqpage1 = $("#dqpage").attr("value");
        var dqpage2 = $("#page").attr("value");
        var bookid = $("#bookid").attr("value");
        var url = "https://wap.cmread.com/r/p/ybzjdata.jsp?page=" + page + "&vt=3&bid=" + bookid + "&cid=" + chapterid;
        console.log(move);
        $.ajax({
            url: url,
            success: function(data) {
                var startidex = data.indexOf('<anyce>');
                var endindex = data.indexOf('</anyce>');
                var str = data.substring(startidex + 7, endindex);
                var arr = str.split(",");
                var index = 0;
                if (dqindex % 20 == 0 && dqindex >= 20) {
                    index = dqindex - 20 * (dqpage - 1);
                } else {
                    index = dqindex - 20 * dqpage;
                }
                for (i = 0; i < arr.length; i++) {
                    var newSlide = mySwiper.createSlide(arr[i], 'swiper-slide', 'div');
                    if (pd == "down") {
                        var slideNum = $(".swiper-slide").size();
                        mySwiper.insertSlideAfter(i, newSlide);
                        var dqpage = parseInt(dqindex / 20);
                        $("#slpage").attr("value", page);
                    } else if (pd == "up") {
                        var slideNum = $(".swiper-slide").size();
                        mySwiper.insertSlideAfter(slideNum - 3, newSlide);
                        $("#page").attr("value", page);
                    }
                }

                if (pd == "down") {
                    mySwiper.removeSlide(0)
                    var spage = $("#slpage").attr("value");
                    var t = parseInt(parseInt(dqpage1) - spage);
                    mySwiper.swipeTo(t * 20, 0, false);
                    $("#dqpage").attr("value", parseInt(parseInt(dqpage1) - 1));
                    xlyb = 0;
                } else {
                    mySwiper.removeLastSlide();
                    slyb = 0;
                }
                slybnum = 0;
                move = 0;
                console.log(move);
            }
        });

    }
}

/**
javascript:(function(){var script = document.createElement("script");script.type = "text/javascript";script.src = "http://localhost:5000/js/track.js";document.body.appendChild(script);})();
*/