/**
 * gulp打包
 */
var gulp = require("gulp");
var cssnano = require('gulp-cssnano'); //-压缩css
var cleancss = require('gulp-clean-css'); //-压缩css
var connect = require('gulp-connect'); //创建web服务器
var watch = require('gulp-watch'); //监听文件变化
var sass = require('gulp-sass'); //sass
var sourcemaps = require('gulp-sourcemaps'); //-添加map文件
var uglify = require('gulp-uglify'); //js压缩混淆
var concat = require('gulp-concat'); //文件合并all-in-one
var webpack = require('webpack'); //webpack模块化打包js
var rename = require('gulp-rename'); //修改后缀
var path = require('path');
var rev = require('gulp-rev');   //添加版本号
var revCollector = require('gulp-rev-collector');

//路径配置

/* js */
var _js_lib_dir = [
	"src/lib/js/jquery-1.11.0.min.js",
	"src/lib/js/flexible.js",
	"src/lib/js/flexible_css.js",
	"src/lib/js/json2.js",
	"src/lib/js/underscore-min.js",
	"src/lib/js/backbone-min.js",
	"src/lib/js/backbone.localStorage-min.js",
	"src/lib/js/timeago.js",
	"src/lib/js/locales/timeago.zh-cn.js"
]; //js库文件

var _js_dir = [
	"src/js/stat.js",
	"src/js/app.js"
]; //js文件

var _js_modules_dir = [
	"src/js/init.js", //初始化全局配置
	"src/js/stat.js", //统计相关
	"src/js/models/*.js", //数据对象
	"src/js/views/*.js", //视图
	"src/js/views/components/*.js", //视图组件
	"src/js/views/pages/*.js", //页面组件
	"src/js/router.js", //路由
	"src/js/startwork.js", //开始工作
]; //js组件和模块文件

var _js_dist_dir = "dist/js"; //js导出目录
var _js_lib_min_name = "lib.min.js"; //压缩后的js类库名称
var _js_min_name = "app.min.js"; //压缩后的js名称

/* css */
var _css_dir = [
	"src/lib/css/animation.min.css",
	"src/css/*.css",
]; //css文件

var scss_dir = [{
	name: "common.min.css", //公共的
	dir: [
		"src/scss/common.scss"
	]
}, {
	name: "detail.min.css", //详情页面
	dir: [
		"src/scss/pages/detail.scss"
	]
}]; //scss文件

var _css_dist_dir = "dist/css"; //css导出目录
var _css_min_name = "app.min.css"; //压缩后的css名称

/* 图片文件 */
var _images_dir = [
	"src/images/*",
	"src/images/*/*"
];

var _images_dist_dir = "dist/"; //图片导出目录

/* html */
var _html_dir = [
	"src/*.html"
]; //html文件

var _html_templates = [{
	html_name: "index.html", //合并之后的名字
	templates: [ //模版顺序
		"src/templates/header.html", //头部
		"src/templates/components/*.html", //视图组件
		"src/templates/pages/*.html", //页面
		"src/templates/footer.html" //底部
	]
}]; //html模版文件

var _html_dist_dir = "dist/"; //html导出目录

var js_version = "dist/js"  //js版本导出目录

//web 服务器
gulp.task("web", function() {
	connect.server({
		port: 5000,
		root: "dist",
		livereload: true
	});
});

//刷新任务
gulp.task("reload", function() {
	gulp.src([
		"src/*.html" //需要的页面
	]).pipe(connect.reload());
});

//文件监听任务
gulp.task("watch", function() {
	gulp.watch([
		"src/*.html",
		"src/templates/*.html",
		"src/templates/components/*.html",
		"src/templates/pages/*.html",
		"src/css/*.css",
		"src/js/*.js",
		"src/js/events/*.js",
		"src/js/models/*.js",
		"src/js/views/*.js",
		"src/js/views/components/*.js",
		"src/js/views/pages/*.js",
		"src/track/*.js",
		"src/scss/*.scss",
		"src/scss/*/*.scss",
	], ["cssTask", "jsTask", "htmlTask", "reload"]);
});

//css压缩任务
gulp.task("cssTask", function() {

	console.log("开始执行css压缩任务");
	gulp.src(_css_dir)
		.pipe(concat(_css_min_name)) //合并css
		.pipe(cssnano()) //压缩css

	.pipe(gulp.dest(_css_dist_dir)); //处理得到的css文件发布到对应目录

	//scss目录,scss_dir
	for (var i = 0; i < scss_dir.length; i++) {
		var item = scss_dir[i];
		gulp.src(item["dir"])
			.pipe(sourcemaps.init()) //map初始化
			.pipe(rename({
				suffix: '.min'
			}))
			.pipe(sass().on('error', function(error) {
				console.log("压缩sass出错:", error);
			}))
			.pipe(sass({
				outputStyle: 'compressed'
			}))
			.pipe(sourcemaps.write('maps/'))
			.pipe(gulp.dest(_css_dist_dir));
	}
});

//js压缩任务
gulp.task("jsTask", function() {
	console.log("开始执行js压缩混淆任务", _js_dist_dir);

	//压缩js类库文件
	console.log("压缩类库js");
	gulp.src(_js_lib_dir)
		//	    .pipe(sourcemaps.init())             //map初始化
		.pipe(concat(_js_lib_min_name)) //合并js
		.pipe(uglify()) //压缩混淆
		.on("error", function(error) {
			console.log("压缩js出错:", error);
		})
		// .pipe(sourcemaps.write(path.relative(_js_dist_dir, _js_dist_dir), {
		// 	sourceMappingURL:function(file){
		// 		return '/'+_js_dist_dir+file.relative+'.map';
		// 	}
		// }))//- maps另存
		.pipe(gulp.dest(_js_dist_dir)); //处理得到的js文件发布到对应目录

	//压缩自己的js文件
	console.log("压缩自己的js文件");
	gulp.src(_js_dir)
		// .pipe(sourcemaps.init())//map初始化
		.pipe(concat(_js_min_name)) //合并js
		// .pipe(uglify())//压缩混淆
		.on("error", function(error) {
			console.log("压缩js出错:", error);
		})
		// .pipe(sourcemaps.write(path.relative(_js_dist_dir, _js_dist_dir), {
		// 	sourceMappingURL:function(file){
		// 		return '/'+_js_dist_dir+file.relative+'.map';
		// 	}
		// }))//- maps另存
		.pipe(gulp.dest(_js_dist_dir)); //处理得到的js文件发布到对应目录

	//压缩模块化的js:_js_modules_dir
	console.log("压缩模块化的js");
	gulp.src(_js_modules_dir)
		.pipe(concat("app.min.js")) //合并js
		// .pipe(uglify())                  //压缩混淆
		.on("error", function(error) {
			console.log("压缩js出错:", error);
		})
		.pipe(gulp.dest(_js_dist_dir)); //处理得到的js文件发布到对应目录

	console.log("压缩注入js");
	gulp.src(["src/lib/js/jquery-3.1.0.min.js", "src/track/track.js"])
		.pipe(concat("track.js")) //合并js
		// .pipe(uglify())                  //压缩混淆
		.on("error", function(error) {
			console.log("压缩js出错:", error);
		})
		.pipe(gulp.dest(_js_dist_dir)); //处理得到的js文件发布到对应目录
});

//html合并和静态文件转移任务
gulp.task("htmlTask", function() {
	console.log("开始执行html模版合并和静态文件转移任务");

	//合并模版
	for (var i = 0; i < _html_templates.length; i++) {
		var item = _html_templates[i];
		gulp.src(item["templates"])
			.pipe(concat(item["html_name"])) //合并html
			.pipe(gulp.dest(_html_dist_dir)); //处理得到的html文件发布到对应目录
	}

	//转移根目录images文件
	gulp.src(_images_dir, {
			base: "src"
		})
		.pipe(gulp.dest(_images_dist_dir)); //处理得到的image文件发布到对应目录

	//html
	gulp.src(_html_dir)
		.pipe(gulp.dest(_html_dist_dir)); //处理得到的html文件发布到对应目录


		
  gulp.src(['rev/**/*.json', 'dist/*.html'])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                'css': '/css/rev',
                'js/': '/js/rev/'
            }
        }) )
        .pipe( gulp.dest('dist'))
});

//部署版本号
gulp.task('cssVersion', function () {
    return gulp.src('dist/css/*.css')
        .pipe(rev())
        .pipe(gulp.dest('dist/css/rev'))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( 'rev/css' ) );
});

gulp.task('jsVersion', function () {
    return gulp.src('dist/js/*.js')
        .pipe(rev())
        .pipe(gulp.dest('dist/js/rev'))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( 'rev/js' ) );
});





gulp.task("default", function() {
	console.log("开始执行默认任务");
});

gulp.task('default', ["cssTask", "jsTask","cssVersion","jsVersion","htmlTask","web", "watch"]); //默认任务
gulp.task('build', ["cssTask", "jsTask","cssVersion","jsVersion","htmlTask"]); //发布任务,进行css压缩,js压缩