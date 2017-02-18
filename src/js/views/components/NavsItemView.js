//大分类导航item视图
window.ebookweb.views.components.NavsItemView = window.ebookweb.views.ItemBaseView.extend({
	tagName:"nav",
	className:"circle-classes-nav item-view",
	template:_.template($("#navs_item_view_template").html()),
	events:{
		//事件
		"click ul li:eq(0) a":"onClassNameClick",
		"click ul li:eq(1) a":"onClassNameClick",
		"click ul li:eq(2) a":"onClassNameClick",
		"click ul li:eq(3) a":"onMoreNavItemClick"
	},
	mapping:
	{
		'奇幻': '0 0',
		'出版': '0 -40px',
		'都市': '0 -80px',
		'官场': '0 -120px',
		'军事': '0 -160px',

		'灵异': '0 -200px',
		'更多': '0 -240px',
		'其它': '0 -280px',
		'穿越': '0 -320px',
		'言情': '0 -360px',
		'武侠': '0 -400px',

		'仙侠': '0 -440px',
		'校园': '0 -480px',
		'玄幻': '0 -520px',
		'悬疑': '0 -560px',
		'影视': '0 -600px',
		'游戏': '0 -640px'
	},
	initialize:function(){
		//初始化

		//转换数据,根据分类设置对应的分类css
		_.each(this.model.get("data"),function(item,index){
			console.log(item,index);
			item["wordBackground"] = this.mapping[item["cateName"]];
		},this);

		console.log(this.model.toJSON());
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},
	onClassNameClick:function(e){
		//分类点击
		console.log("分类点击",e.currentTarget);

		ka(
			'info',
			StatMap.MainPageClassesStatMap[$(e.currentTarget).data("catename")]
		);

		return true;
	},
	onMoreNavItemClick:function(){
		//点击更多按钮,今日分类列表页面
		console.log("more click");

		console.log("点击更多");
		ka(
			'info',
			'p4=2&p5=6&p6=3&p7=2'
		);

		window.ebookweb.mediator.trigger(window.ebookweb.events.CHANGE_MAIN_PAGE_TAB_EVENT,"class");
	}
});