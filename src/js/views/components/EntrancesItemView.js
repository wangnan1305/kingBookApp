//分类导航item视图
window.ebookweb.views.components.EntrancesItemView = window.ebookweb.views.ItemBaseView.extend({
	tagName:"section",
	className:"entrances item-view",
	attributes:{
	},
	template:_.template($("#entrances_item_view_template").html()),
	events:{
		//事件
		"click .first li a":"onClassNameClick",
		"click .second li a":"onRankNameClick"
	},
	initialize:function(){
		//初始化
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
	}
});