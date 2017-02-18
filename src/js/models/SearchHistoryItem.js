//搜索历史数据对象
window.ebookweb.models.SearchHistoryItem = Backbone.Model.extend({
	defaults:{
		keyword:"",
		value:""
	}
});

//搜索历史数据列表
window.ebookweb.models.SearchHistoryList = Backbone.Collection.extend({
	model:window.ebookweb.models.SearchHistoryItem,
	localStorage: new Backbone.LocalStorage("ebook-search-history"),
});