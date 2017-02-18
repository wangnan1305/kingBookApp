/**
*	读书前端统计js
*/

!function(e,n,t,s,a,c,r){e.KSOSieve=a,e[a]=e[a]||function(){(e[a].q=e[a].q||[]).push(arguments);
  },e[a].t=1*new Date,c=n.createElement(t),r=n.getElementsByTagName(t)[0],c.async=1,
  c.src=s,r.parentNode.insertBefore(c,r)}(window,document,"script","//ka.wpscdn.cn/ka.js","ka");

var StatMap = {
	'完本': 1,
	'连载': 2,
	MainPageClassesStatMap: {
		'言情': 'p4=2&p5=6&p6=4&p7=1',
		'都市': 'p4=2&p5=6&p6=4&p7=2',
		'玄幻': 'p4=2&p5=6&p6=4&p7=3',
		'仙侠': 'p4=2&p5=6&p6=4&p7=4',
		'穿越': 'p4=2&p5=6&p6=4&p7=5',

		'官场': 'p4=2&p5=6&p6=4&p7=6',
		'奇幻': 'p4=2&p5=6&p6=4&p7=7',
		'灵异': 'p4=2&p5=6&p6=4&p7=8',
		'武侠': 'p4=2&p5=6&p6=4&p7=9',
		'科幻': 'p4=2&p5=6&p6=4&p7=10',

		'历史': 'p4=2&p5=6&p6=4&p7=11',
		'游戏': 'p4=2&p5=6&p6=4&p7=12',
		'笑话': 'p4=2&p5=6&p6=4&p7=13',
		'校园': 'p4=2&p5=6&p6=4&p7=14',
		'军事': 'p4=2&p5=6&p6=4&p7=15'
  }
};

//统计函数
var Stat = {
	start:function(){
		//记录开始
		var tempArr = [];
		var p3 = 1;
		var info;
		var searchArr;

		//读取android webview的配置信息
		info = JSON.parse(window.read.jsGetDeviceInfo());
		searchArr = window.location.search.slice(1).split('&');
		$.each(searchArr, function (index, item) {
			tempArr = item.split('=');
			if (tempArr[0] === 'from') {
				p3 = tempArr[1];
				return false;
			}
		});

		info.app_version = info.app_version.replace(/\./g,'_');

		ka(
			'create',
			'dm=/wps/android/novel',
			'action=novel',
			'pnum=1',
			'p0=' + info.uid,
			'p1=' + info.channel,
			'p2=' + info.app_version,
			'p3=' + p3
		);

		console.log("stat start");
	},
	ka:function(){
		//监测
		console.log("arguments:",arguments);
		ka(arguments);
	}
};

if(!window.splash)
window.splash = {
	jsGetDeviceInfo:function(){
		var mockData = {
        uid: 'tao',
        channel: 'cn00999',
        app_version: '9.9.2'
      };
     return JSON.stringify(mockData);
	}
}

if (!window.read) {
  ka(
    'create',
    'dm=/wps/android/novel',
    'action=novel',
    'pnum=1'
  );

  window.read = {
    jsGetDeviceInfo: function () {
      var mockData = {
        uid: 'tao',
        channel: 'cn00999',
        app_version: '9.6.2'
      };
      return JSON.stringify(mockData);
    },
    jsGetDeviceInfo:function(){
    	var mockData2 = {
        uid: 'tao',
        channel: 'cn00999',
        app_version: '9.8.9'
      };
      return JSON.stringify(mockData2)
    }
  };
} else {
	Stat.start();
}