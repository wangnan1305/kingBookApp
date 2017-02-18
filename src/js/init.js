/**
*	读书前端全局配置初始化js,进行一些全局的数据初始化工作
*/

(function(){
	console.log("初始化前端框架");

	//全局常量
	window.ebookweb = {
		config:{
			//api
			api_host:"http://book.rdtuijian.com/"
		},
		mediator:{},//主事件监听
		views:{
			//全部视图,其他模块组件,页面组件类统一存储到此包里面
			components:{
				//组件
			},
			pages:{
				//页面
			}
		},
		events:{
			//事件
			"GO_TO_MAIN_PAGE_EVENT":"goToMainPage",//去主页
			"CHANGE_MAIN_PAGE_TAB_EVENT":"changeMainPageTabEvent",//点击主页的标签事件,进行精选,排行榜,分类子页面的切换
			"POPUP_PAGE_EVENT":"popupPageEvent",//弹出一个新页面事件
			"REMOVE_PAGE_EVENT":"removePageEvent"//删除一个页面事件
		},
		utils:{
			Event://通用事件监听函数
			{
				// 绑定事件
				addEvent: function (element, type, handler) {
					if (element.addEventListener) {
						//事件类型、需要执行的函数、是否捕捉
						element.addEventListener(type, handler, false);
					} else if (element.attachEvent) {
						element.attachEvent('on' + type, handler);
					} else {
						element['on' + type] = handler;
					}
				},
				// 移除事件
				removeEvent: function (element, type, handler) {
					if (element.removeEventListener) {
						element.removeEventListener(type, handler, false);
					} else if (element.detachEvent) {
						element.detachEvent('on' + type, handler);
					} else {
						element['on' + type] = null;
					}
				},
				// 阻止事件 (主要是事件冒泡，因为IE不支持事件捕获)
				stopPropagation: function (ev) {
					if (ev.stopPropagation) {
						ev.stopPropagation();
					} else {
						ev.cancelBubble = true;
					}
				},
				// 取消事件的默认行为
				preventDefault: function (event) {
					if (event.preventDefault) {
						event.preventDefault();
					} else {
						event.returnValue = false;
					}
				}
			},
			Calculator://相关计算
			{
				delZero: function (numStr) {
					//如果小数位为0,则删除小数位
					numStr = String(Number(numStr).toFixed(1));

					if (numStr.indexOf('.0') > -1) {
						numStr = numStr.slice(0, -2);
					}

					return numStr;
				},
				fixedCount: function (wordCount) {
					//人数、阅读量超过999.9万，统一给出为999.9+万
					var resultStr;
					var NUMBER_LIMITATION = 999.9;

					wordCount = Number(wordCount);
					if ((wordCount < 10000)) {
						resultStr = this.delZero(wordCount);
					} else {
						wordCount = wordCount / 10000;
						if (wordCount >= NUMBER_LIMITATION) {
							resultStr = String(NUMBER_LIMITATION);
						} else {
							resultStr = this.delZero(wordCount);
						}
						resultStr = resultStr + '万';
					}

					return resultStr;
				},
				getDateDiff:function(dateTimeStamp) {
					var minute = 1000 * 60;
					var hour = minute * 60;
					var day = hour * 24;
					var halfamonth = day * 15;
					var month = day * 30;
					var now = new Date().getTime();
					var diffValue = now - dateTimeStamp;
					if(diffValue < 0){return;}
					var monthC =diffValue/month;
					var weekC =diffValue/(7*day);
					var dayC =diffValue/day;
					var hourC =diffValue/hour;
					var minC =diffValue/minute;
				
					if(hourC <= 1 && hourC > 0){
						result="[刚刚更新]";
					}else if(hourC <= 24){
						result="["+parseInt(hourC) + "小时前更新]"
					}else if(hourC > 24){
						result="["+this.getFormatTime(dateTimeStamp)+"更新]"
					}

					if(dayC >= 30){
						result = "";
					}


					return result;
				},
				getFormatTime: function(time) {
					var time = new Date(time);
					var y = time.getFullYear();
					var m = time.getMonth() + 1;
					var d = time.getDate();
					return y + '-' + this.add0(m) + '-' + this.add0(d);
				},
				add0:function(number){
					return number < 10 ? '0'+number : number;
				}
			},
			openBookWeb:function(url,mode)
			{
				//新的webview打开
				if(url.substr(0,4)!="http")
				{
					url=window.location.host+url;
				}

				console.log("openBookWeb:",url,mode);

				if(window.read&&window.read.jsOpenDefinedInterface&&mode=="webview") 
				{
					window.read.jsOpenDefinedInterface("readwebview", url);
					return false;
				}
				else
				{
					return true;
				}
			}
		},
		data:{
			//存储的数据
			GlobalData:{}//全局数据
		},
		models:{
			//数据对象
		}
	};

	_.extend(window.ebookweb.mediator,Backbone.Events)
})();