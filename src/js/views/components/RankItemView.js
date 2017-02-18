//排行榜item视图
window.ebookweb.views.components.RankItemView = window.ebookweb.views.ItemBaseView.extend({
	tagName:"ul",
	className:"top",
	template:_.template($("#rank_item_view_template").html()),
	mapping: {
		'畅销榜': '0 -64px',
		'人气榜': '0 -128px',
		'飙升榜': '0 0',
		'热搜榜': '0 -192px',
		'推荐榜': '0 -256px',
		'完结榜': '0 -320px'
	},
	stats:{//大分类埋点标识
		'畅销榜': '1',
		'人气榜': '2',
		'飙升榜': '3',
		'热搜榜': '4',
		'推荐榜': '5',
		'完结榜': '6'
	},
	events:{
		//事件
		"click li a.nav":"onRankListLinkClick",//分类排行点击
		"click li a.read":"onBookLinkClick"//书籍点击
	},
	initialize:function(){
		//初始化
		var list = this.model.get("data");
		_.each(list,function(item,index){
			item["rankCoverBackround"] = this.mapping[item["rankName"]];

			_.each(item["books"],function(sub_item,sub_index){
				sub_item["readCountFormated"] = window.ebookweb.utils.Calculator.fixedCount(sub_item["readCount"]);
			},this);
		},this);
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},
	onRankListLinkClick:function(e){
		//分类排行点击
		console.log("分类排行点击",e.currentTarget);

		ka(
			'info',
			'p4=2&p5=13&p6='+this.stats[$(e.currentTarget).data("rankname")]
		);

		return true;
	},
	onBookLinkClick:function(e)
	{
		//书链接点击
		console.log("书籍点击",e.currentTarget);

		ka(
			'info',
			'p4=2&p5=13&p6=7&p7=' + $(e.currentTarget).data("title") + '&p8=' + $(e.currentTarget).data("rankname")
		);

		var url = $(e.currentTarget).attr("href");
		return window.ebookweb.utils.openBookWeb(url);
	},
});