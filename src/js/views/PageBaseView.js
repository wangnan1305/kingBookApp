//单页面基础视图
window.ebookweb.views.PageBaseView = Backbone.View.extend({
	tagName:"main",
	show:function(){
		
	},
	show1:function(animation){
		//显示
		var self = this;
		var animation = animation || "fadeIn";
		animation+=" animated";

		this.$el.addClass(animation).one(animation_end,function(){
			self.$el.removeClass(animation);
		});
	},
	destroy:function(){
		this.remove();
	},
	destroy1:function(animation){
		//删除
		var self = this;
		var animation = animation || "fadeOut";
		animation+=" animated";

		this.$el.addClass(animation).one(animation_end,function(){
			self.$el.removeClass(animation);
			self.remove();
		});
	}
});