//分类item视图
window.ebookweb.views.components.ClassesItemView = window.ebookweb.views.ItemBaseView.extend({
	tagName:"ol",
	template:_.template($("#classes_item_view_template").html()),
	mapping: {
		'热门': 'cate0',
		'男频': 'cate1',
		'女频': 'cate2',
		'出版': 'cate3'
	},
	stats:{
		first:{
			'热门': '1',
			'男频': '2',
			'女频': '3',
			'出版': '4'
		},
		sub:{
			"言情":"1",
			"都市":"2",
			"玄幻":"3",
			"仙侠":"4",
			"穿越":"5",
			"官场":"6",
			"奇幻":"7",
			"灵异":"8",
			"武侠":"9",
			"科幻":"10",
			"历史":"11",
			"游戏":"12",
			"笑话":"13",
			"校园":"14",
			"军事":"15",
			"生活休闲":"16",
			"影视剧本":"17",
			"文学小说":"18",
			"文史传记":"19",
			"经管励志":"20",
			"社科科普":"21",
			"教育教辅":"22",
			"情感小说":"23",
			"灵异悬疑":"24",
		},
		p5:{
			"言情":"21",
			"都市":"22",
			"玄幻":"23",
			"仙侠":"24",
			"穿越":"25",
			"官场":"26",
			"奇幻":"27",
			"灵异":"28",
			"武侠":"29",
			"科幻":"30",
			"历史":"31",
			"游戏":"32",
			"笑话":"33",
			"校园":"34",
			"军事":"35",
			"生活休闲":"36",
			"影视剧本":"37",
			"文学小说":"38",
			"文史传记":"39",
			"经管励志":"40",
			"社科科普":"41",
			"教育教辅":"42",
			"情感小说":"43",
			"灵异悬疑":"44",
		},
		p6:{
			'热门':'3',
			"男频":"1",
			"女频":"2",
			'出版': '4'
		}
	},
	events:{
		//事件
		"click ul li a":"onClassLinkClick"
	},
	initialize:function(){
		//初始化
		var list = this.model.get("data");
		_.each(list,function(item,index){
			item["cateIconClass"] = this.mapping[item["cateClassName"]];

			_.each(item["cateList"],function(sub_item,sub_index){
				sub_item["stat_p5"] = this.stats["p5"][sub_item["cateName"]];
				sub_item["stat_p6"] = this.stats["p6"][item["cateClassName"]];
			},this);
		},this);
	},
	render:function(){
		//渲染
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},
	onClassLinkClick:function(e){
		//分类点击
		console.log("分类item点击:",e.currentTarget,"p6=",this.stats.sub[$(e.currentTarget).data("catename")],"p7=",this.stats.first[$(e.currentTarget).data("groupname")]);

		ka(
			'info',
			'p4=2&p5=20&p6=' + this.stats.sub[$(e.currentTarget).data("catename")] +'&p7=' + this.stats.first[$(e.currentTarget).data("groupname")]
		);

		return true;
	}
});