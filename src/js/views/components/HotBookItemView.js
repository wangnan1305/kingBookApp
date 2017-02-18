//热搜榜item视图
window.ebookweb.views.components.HotBookItemView = window.ebookweb.views.ItemBaseView.extend({
	tagName:"section",
	className:"hot-book item-view",
	attributes:{
	},
	template:_.template($("#hot_book_item_view_template").html()),
	events:{
		//事件
		"click h3 a":"change",
		"click ul li a":"onBookLinkClick"//书籍点击
	},
	initialize:function(){
		//初始化
		this.listenTo(this.model,"change",this.render);
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},
	change:function(){
		//换一批
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
				this.model.set({data:result});
			}
			else
			{
				alert("没有数据");
			}
		});

		ka(
			'info',
			'p4=2&p5=6&p6=7'
		);
	},
	onBookLinkClick:function(e){
		//点击搜索热词
		console.log("点击搜索热词",e.currentTarget);

		ka(
			'info',
			'p4=2&p5=6&p6=6&p7=' + $(e.currentTarget).data("title")
		);

		var url = $(e.currentTarget).attr("href");
		return window.ebookweb.utils.openBookWeb(url);
	}
});