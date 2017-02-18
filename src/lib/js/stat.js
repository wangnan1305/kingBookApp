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
			if (tempArr[0] === 'p3') {
				p3 = tempArr[1];
				return false;
			}
		});

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

		ka(
			'info',
			'p4=1&p5=1'
		);

		console.log("stat start");
	},
	ka:function(){
		//监测
		console.log("arguments:",arguments);
		ka(arguments);
	}
};

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
    }
  };
}

//测试数据
var lastestRead = {
bookmarkList: [
{
title: "雷军传：站在风口上",
bookid: "388137205",
chapterName: "CHAPTER ONE 百亿美金的梦想家",
chapterId: "388137209",
lastChapterId: "388137222",
lastChaterName: "后记",
imgUrl: "http://wap.cmread.com/r/cover_file/7205/388137205/20131029095144/cover180240.jpg",
url: "http://wap.cmread.com/r/l/r.jsp?bid=388137205&cid=388137209&vt=3&radmode=2&cm=M32Z0002&third_accesstoken=djaEdYEZyA8cFZSVgM7fdQ=="
},
{
title: "史蒂夫·乔布斯传",
bookid: "373055791",
chapterName: "主要人物",
chapterId: "373055793",
lastChapterId: "373055835",
lastChaterName: "后记 致谢",
imgUrl: "http://wap.cmread.com/r/cover_file/5791/373055791/20120531110335/cover180240.jpg",
url: "http://wap.cmread.com/r/l/r.jsp?bid=373055791&cid=373055793&vt=3&radmode=2&cm=M32Z0002&third_accesstoken=djaEdYEZyA8cFZSVgM7fdQ=="
},
{
title: "月沉吟",
bookid: "346357090",
chapterName: "第九章投鞭断殳",
chapterId: "346357100",
lastChapterId: "346357169",
lastChaterName: "第七十八章遥山云起夜雨迟",
imgUrl: "http://wap.cmread.com/r/cover_file/7090/346357090/20120312170759/cover180240.jpg",
url: "http://wap.cmread.com/r/l/r.jsp?bid=346357090&cid=346357100&vt=3&radmode=2&cm=M32Z0002&third_accesstoken=djaEdYEZyA8cFZSVgM7fdQ=="
},
{
title: "女总裁的王牌高手",
bookid: "409537199",
chapterName: "第1章 只是吃个面",
chapterId: "409537228",
lastChapterId: "441916937",
lastChaterName: "第602章 就是一个差评而已",
imgUrl: "http://wap.cmread.com/r/cover_file/7199/409537199/20150827113215/cover180240.jpg",
url: "http://wap.cmread.com/r/l/r.jsp?bid=409537199&cid=409537228&vt=3&radmode=2&cm=M32Z0002&third_accesstoken=djaEdYEZyA8cFZSVgM7fdQ=="
},
{
title: "28岁赚千万：从负债百万到赚取千万的真实创业经历",
bookid: "385548745",
chapterName: "一个从天堂到地狱的家庭",
chapterId: "385550053",
lastChapterId: "385550090",
lastChaterName: "从身家百万到一无所有，我经历了“冰火两重天”",
imgUrl: "http://wap.cmread.com/r/cover_file/8745/385548745/20130812175035/cover180240.jpg",
url: "http://wap.cmread.com/r/l/r.jsp?bid=385548745&cid=385550053&vt=3&radmode=2&cm=M32Z0002&third_accesstoken=djaEdYEZyA8cFZSVgM7fdQ=="
},
{
title: "心术",
bookid: "372460186",
chapterName: "04.我是功臣之后",
chapterId: "372460191",
lastChapterId: "372460217",
lastChaterName: "作者手记",
imgUrl: "http://wap.cmread.com/r/cover_file/0186/372460186/20120518143313/cover180240.jpg",
url: "http://wap.cmread.com/r/l/r.jsp?bid=372460186&cid=372460191&vt=3&radmode=2&cm=M32Z0002&third_accesstoken=djaEdYEZyA8cFZSVgM7fdQ=="
},
{
title: "从0到1：开启商业与未来的秘密",
bookid: "404944122",
chapterName: "第3章 所有成功的企业都是不同的",
chapterId: "404944130",
lastChapterId: "404944144",
lastChaterName: "插图版权声明",
imgUrl: "http://wap.cmread.com/r/cover_file/4122/404944122/20150306163415/cover180240.jpg",
url: "http://wap.cmread.com/r/l/r.jsp?bid=404944122&cid=404944130&vt=3&radmode=2&cm=M32Z0002&third_accesstoken=djaEdYEZyA8cFZSVgM7fdQ=="
},
{
title: "超级俗人",
bookid: "401310761",
chapterName: "第14章 调戏",
chapterId: "401310776",
lastChapterId: "441920213",
lastChaterName: "第1867章 碾压的打斗",
imgUrl: "http://wap.cmread.com/r/cover_file/0761/401310761/20150130111437/cover180240.jpg",
url: "http://wap.cmread.com/r/l/r.jsp?bid=401310761&cid=401310776&vt=3&radmode=2&cm=M32Z0002&third_accesstoken=djaEdYEZyA8cFZSVgM7fdQ=="
},
{
title: "做自己的事业",
bookid: "8792634",
chapterName: "二建立良好的人际关系(2)",
chapterId: "8792638",
lastChapterId: "8792642",
lastChaterName: "五积极创新--做大公司的惟一之路",
imgUrl: "http://wap.cmread.com/r/cover_file/2634/8792634/20101125220000/cover180240.jpg",
url: "http://wap.cmread.com/r/l/r.jsp?bid=8792634&cid=8792638&vt=3&radmode=2&cm=M32Z0002&third_accesstoken=djaEdYEZyA8cFZSVgM7fdQ=="
},
{
title: "兄弟我在义乌的发财史",
bookid: "353698540",
chapterName: "第一章 一天没吃饭了，两天没抽烟了，三天没洗澡了！",
chapterId: "353698542",
lastChapterId: "353698569",
lastChaterName: "第二十八章 家是我打拼的力量源泉",
imgUrl: "http://wap.cmread.com/r/cover_file/8540/353698540/20101213154148/cover180240.jpg",
url: "http://wap.cmread.com/r/l/r.jsp?bid=353698540&cid=353698542&vt=3&radmode=2&cm=M32Z0002&third_accesstoken=djaEdYEZyA8cFZSVgM7fdQ=="
},
{
title: "就像没有明天那样去生活",
bookid: "407952368",
chapterName: "就像没有明天那样去生活",
chapterId: "407952370",
lastChapterId: "407952405",
lastChaterName: "什么是真正的爱，什么是虚假的爱",
imgUrl: "http://wap.cmread.com/r/cover_file/2368/407952368/20150624112635/cover180240.jpg",
url: "http://wap.cmread.com/r/l/r.jsp?bid=407952368&cid=407952370&vt=3&radmode=2&cm=M32Z0002&third_accesstoken=djaEdYEZyA8cFZSVgM7fdQ=="
},
{
title: "武神",
bookid: "346018647",
chapterName: "第一章 贺家六子",
chapterId: "346018649",
lastChapterId: "354802032",
lastChaterName: "第七百六十九章 天边的尽头（大结局）",
imgUrl: "http://wap.cmread.com/r/cover_file/8647/346018647/20140923150421/cover180240.jpg",
url: "http://wap.cmread.com/r/l/r.jsp?bid=346018647&cid=346018649&vt=3&radmode=2&cm=M32Z0002&third_accesstoken=djaEdYEZyA8cFZSVgM7fdQ=="
}
]
};