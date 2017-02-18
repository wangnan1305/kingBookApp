//免费item视图
window.ebookweb.views.components.FreeItemView = window.ebookweb.views.ItemBaseView.extend({
	tagName:"ul",
	template:_.template($("#free_item_view_template").html()),
	events:{
		//事件
		"click li a":"onBookLinkClick"
	},
	initialize:function(){
		//初始化
		this.listenTo(this.model,"change",this.render);
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));

		if(!this.model.get("data"))
		{
			//获取数据
			$.ajax({
				url:window.ebookweb.config.api_host+"free",
				method:"get",
				data:null,
				dataType:"json",
				context:this
			}).always(function(result){
				console.log("免费页数据:",result);

				if(result.data)
				{
					var startdate = Math.floor(new Date().getTime()/1000);
					this.model.set({leavetime:"限时免费：",startdate:startdate,expire:result.expire,data:result.data});

					//显示倒计时
					var self = this;
					this.freetime_interval = setInterval(function(){
						self.getFreeLeaveTime();
					},1000);
				}
			});
		}

		return this;
	},
	getFreeLeaveTime:function()
	{
		//计算剩余时间
		var startdate = Math.floor(new Date().getTime()/1000);
		var the_s=[this.model.get("expire")-startdate];
		var the_s_index = 0;

		// console.log("计算倒计时:",this.model.get("startdate"),this.model.get("expire"),the_s);

		if(the_s[the_s_index]>=0)
		{
			var the_D=Math.floor((the_s[the_s_index]/3600)/24) 
			var the_H=Math.floor((the_s[the_s_index]-the_D*24*3600)/3600); 
			var the_M=Math.floor((the_s[the_s_index]-the_D*24*3600-the_H*3600)/60); 
			var the_S=(the_s[the_s_index]-the_H*3600)%60; 
			html = "限时免费：剩余 "; 
			if(the_D!=0) html += the_D+"天";
			if(the_D!=0 || the_H!=0) html += '<span class="hour">'+(the_H)+"</span>小时"; 
			if(the_D!=0 || the_H!=0 || the_M!=0) html += '<span class="minute">'+the_M+"</span>分"; 
			html += '<span class="second">'+the_S+"</span>秒";

			// console.log(html);

			this.$(".time").html(html); 
			the_s[the_s_index]--;

			return html;
		}
		else
		{ 
			this.$(".time").html("已结束");

			return "已结束";
		} 
	},
	onBookLinkClick:function(e)
	{
		//书链接点击
		console.log("书籍点击",e.currentTarget);

		ka(
			'info',
			'p4=2&p5=48&p6=1&p7=' + (parseInt($(e.currentTarget).data("section"))+1) + '&p8=' + $(e.currentTarget).data("title")
		);

		var url = $(e.currentTarget).attr("href");
		return window.ebookweb.utils.openBookWeb(url);
	}
});