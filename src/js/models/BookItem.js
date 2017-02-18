//书item数据对象
window.ebookweb.models.BookItem = Backbone.Model.extend({
	defaults:{
		cateId: 0,
		imgUrl: "",
		url: "",
		isFromWeb: false,
		completed: "",
		catename: "",
		title: "",
		bookid: 0,
		author: "",
		readCount: 0,
		readCountFormated:0,
		wordCount: 0,
		score: 0,
		isContinue: 0,
		description: "",
		shortRecommend: "",
		bigCoverLogo: "",
		isfromweb: 0
	}
});

//书数据列表
window.ebookweb.models.BookList = Backbone.Collection.extend({
	model:window.ebookweb.models.BookItem
});