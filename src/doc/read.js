var slybnum = 0;
var slyb = 0;
var xlyb = 0
var resetReadArea = null;
var cookieString;
var sizeNo, sizeInfo, sizeLength;
var headHeight, winWidth, winHeight, totalPage;
headHeight = $(".rp_head").height();
winWidth = $(window).width();
winHeight = $(window).height() - headHeight;
var page = 1;
var contentHeight;
var emptyLen;
var pageLen;
var d = 0;
var c = 0;
var r = 0;
var p = 0;
var nav = navigator;
var vendor = (/webkit/i).test(nav.appVersion) ? "webkit" : (/firefox/i).test(nav.userAgent) ? "Moz" : "opera" in window ? "O" : (/MSIE/i).test(nav.userAgent) ? "ms" : "";
var TEnd = vendor === "webkit" ? 'webkitTransitionEnd' : vendor === "Moz" ? TEnd = "transitionend" : vendor === "O" ? TEnd = "oTransitionEnd" : vendor === "ms" ? TEnd = "MSTransitionEnd" : '';
var isFirstTimeNextChapter = 0;
var read = {
    readInit: function() {
        read.fontInit();
        read.daynightInit();
        read.bookBgInit();
        read.fontChange();
        read.bookBgChange();
        read.daynightChange();
        $("#rp_guide").tap(function() {
            $(this).remove()
        });

        $(".read_content").css("marginTop", headHeight);
        if ($(".read_text2").size() > 0) {
            read.pageFormat2();
            document.getElementById("rp_sidebar").addEventListener('touchmove', function(e) {
                e.stopPropagation();
                e.preventDefault();
            });
            read.page
            $("#rp_action .rp_top").click(function() {
                read.touchTop();
            });
            $("#rp_action .rp_bottom").click(function() {
                read.touchBottom();
            });
            $('#rp_action').each(function() {

                var readList = this;
                var startX, endX, startY, endY, lockDirection;
                readList.addEventListener('touchstart', function(e) {
                        startX = endX = e.touches[0].pageX;
                        startY = endY = e.touches[0].pageY;
                        lockDirection = ''
                    },
                    false);
                readList.addEventListener('touchmove', function(e) {

                        $(" .rp_tool_more,.rp_shadow,.rp_tool_bg,.rp_tool_other").fadeOut(300);
                        read.transUtil(".rp_tool_top", 400, 0, 0);
                        read.transUtil(".rp_sidebar", 400, 0, 0);
                        read.transUtil(".rp_tool_bottom", 400, 0, 0);
                        c = 0;
                        if (!lockDirection || lockDirection === 'x') endX = e.changedTouches[0].pageX;
                        if (!lockDirection || lockDirection === 'y') endY = e.changedTouches[0].pageY;
                        if (!lockDirection) {
                            Math.abs(endX - startX) <= Math.abs(endY - startY) ? lockDirection = 'y' : lockDirection = 'x'
                        }
                        if (lockDirection === 'y') {
                            if ($("body").scrollTop() + $(window).height() == $("body").height()) {
                                /*if (startY > endY) { //向上划
                                    read.nextChapter('book');
                                }*/
                            }
                            if ($("body").scrollTop() ==0) {
                                if (startY < endY) { //向下划
                                    read.preChapter('book');
                                }
                            }

                        }
                    },
                    false);
                readList.addEventListener('touchend', function(e) {

                    if (lockDirection === 'y') {
                        if ($("body").scrollTop() + $(window).height() == $("body").height()) {
                            /*if (startY > endY) { //向上划
                                read.nextChapter('book');
                            }*/
                        }
                        if ($("body").scrollTop() == 0) {
                            if (startY < endY) { //向下划
                                read.preChapter('book');
                            }
                        }

                    }
                }, false);
            });
            $(window).resize(read.pageFormat2);
            $(window).scroll(read.pageFormat2);
        } else {
            read.pageFormat();
            read.totalPage2();
            document.body.addEventListener('touchmove', function(e) {
                e.stopPropagation();
                e.preventDefault();
            });
            $("#rp_action .rp_right").click(function() {
                read.moveRight();
            });
            $("#rp_action .rp_left").click(function() {
                read.moveLeft();
            });
            $('#rp_action').each(function() {

                var readList = this;
                var startX, endX, startY, endY, lockDirection;
                readList.addEventListener('touchstart',
                    function(e) {
                        e.stopPropagation();

                        startX = endX = e.touches[0].pageX;
                        startY = endY = e.touches[0].pageY;
                        lockDirection = ''
                    },
                    false);
                readList.addEventListener('touchmove',
                    function(e) {
                        c = 0;
                        e.stopPropagation();
                        if (!lockDirection || lockDirection === 'x') endX = e.changedTouches[0].pageX;
                        if (!lockDirection || lockDirection === 'y') endY = e.changedTouches[0].pageY;
                        if (!lockDirection) {
                            Math.abs(endX - startX) <= Math.abs(endY - startY) ? lockDirection = 'y' : lockDirection = 'x'
                        }
                        if (lockDirection === 'x') {
                            e.preventDefault();
                             $(" .rp_tool_more,.rp_shadow,.rp_tool_bg,.rp_tool_other").fadeOut(300);
                            read.transUtil(".rp_tool_top", 400, 0, 0);
                            read.transUtil(".rp_sidebar", 400, 0, 0);
                            read.transUtil(".rp_tool_bottom", 400, 0, 0);
                            if (startX > endX) {
                                if (page < totalPage) {
                                    if (startX - endX > 0) {
                                        if (r == 0) {
                                            read.transUtil(".rp_cover", 0, -(startX - endX), 0);
                                        } else {
                                            read.transUtil(".read_text", 0, -((page - 1) * winWidth) - (startX - endX), 0);
                                        }
                                    }
                                }
                            } else if (endX > startX) {
                                if (r == 1) {
                                    if (page > 1) {
                                        if (endX - startX > 0) {
                                            read.transUtil(".read_text", 0, -((page - 1) * winWidth) - (startX - endX), 0);
                                        }
                                    } else {
                                        if (endX - startX > 0) {
                                            read.transUtil(".rp_cover", 0, -(winWidth) - (startX - endX), 0);

                                        }
                                    }
                                } else {
                                    read.preChapter('book');
                                }
                            }
                            return
                        }
                    },
                    false);
                readList.addEventListener('touchend', function(e) {
                        e.stopPropagation();
                        if (lockDirection === 'x') {
                            e.preventDefault();
                            if (startX > endX) {
                                if (startX - endX > 50) {
                                    if ($(".rp_cover").size() == 0) {
                                        r = 1;
                                    }
                                    if (r == 0) {
                                        read.transUtil(".rp_cover", 400, -$(window).width(), 0);
                                        r = 1;
                                    } else {
                                        page++;
                                        read.touchRight();
                                        (page > totalPage) ? page = totalPage : page = page;
                                        $(".rp_pageinfo").html(page + "/" + totalPage);
                                    }
                                } else {
                                    if (r == 0) {
                                        read.transUtil(".rp_cover", 400, 0, 0);
                                    } else {
                                        read.transUtil(".read_text", 400, -((page - 1) * winWidth), 0);
                                    }
                                }
                            } else {
                                if (page > 1) {
                                    if (endX - startX > 50) {
                                        (page < 1) ? page = 1 : page = page;
                                        page--;
                                        read.touchLeft();
                                        $(".rp_pageinfo").html(page + "/" + totalPage)
                                    } else {
                                        read.transUtil(".read_text", 400, -((page - 1) * winWidth), 0)
                                    }
                                } else {
                                    if (endX - startX > 50) {
                                        read.transUtil(".rp_cover", 400, 0, 0);
                                        r = 0;
                                    } else {
                                        read.transUtil(".rp_cover", 400, -$(window).width(), 0);
                                        r = 1;
                                    }
                                }
                            }
                        }
                    },
                    false);
            });

            $(window).resize(read.pageFormat);
            $(window).scroll(read.pageFormat)
        }
    },
    touchTop: function() {
        var bTop = $("body").scrollTop();
        var wHeight = $(window).height();
        var bHeight = $("body").height();
        $(".rp_tool_more,.rp_shadow,.rp_tool_bg,.rp_tool_other").fadeOut(300);
        read.transUtil(".rp_tool_top", 400, 0, 0);
        read.transUtil(".rp_sidebar", 400, 0, 0);
        read.transUtil(".rp_tool_bottom", 400, 0, 0);
        c = 0;
        if (bTop > 0) {
            $("body").scrollTop(bTop - (wHeight - 40))
        } else {
            read.preChapter('book');
        }
    },
    touchBottom: function() {
        var bTop = $("body").scrollTop();
        var wHeight = $(window).height();
        var bHeight = $("body").height();
        $(".rp_tool_more,.rp_shadow,.rp_tool_bg,.rp_tool_other").fadeOut(300);
        read.transUtil(".rp_tool_top", 400, 0, 0);
        read.transUtil(".rp_sidebar", 400, 0, 0);
        read.transUtil(".rp_tool_bottom", 400, 0, 0);
        c = 0;
        /*if (bTop + wHeight < bHeight) {
            $("body").scrollTop(bTop + (wHeight - 40));
        } else {
            read.nextChapter('book');
        }*/
if (bTop + wHeight < bHeight) {
            $("body").scrollTop(bTop + (wHeight - 40));
        }

    },
    touchRight: function() {
        if (page < totalPage) {
            read.transUtil(".read_text", 400, -((page - 1) * winWidth), 0);
            read.transUtil(".rp_dsyp", 400, 0, 0);
$("#chapterbigName").hide();
        } else if (page == totalPage) { /*UESFTL-5101 沈霞菲 20150921 wap阅读页月票、打赏、评论修改脚本 */
            read.transUtil(".read_text", 400, -((page - 1) * winWidth), 0);
            read.transUtil(".rp_dsyp", 400, 0, -42);
$(".rp_dsyp").show();
        } else {
            read.nextChapter('book');
            read.transUtil(".rp_dsyp", 400, 0, 0);
        }
        read.totalPage2();
    },
    touchLeft: function() {
        read.transUtil(".rp_dsyp", 400, 0, 0); /*UESFTL-5101 sxf  20150921 wap阅读页月票、打赏、评论新增脚本 */
        if (page == 1) {
            if ($(".rp_cover").size() == 0) {
                r = 0;
            }
            read.transUtil(".read_text", 400, -((page - 1) * winWidth), 0);
$("#chapterbigName").show();
        } else if (page < 1) {
            if ($(".rp_cover").size() > 0) {
                r = 0;
                read.transUtil(".rp_cover", 400, 0, 0);
            }
        } else {
            read.transUtil(".read_text", 400, -((page - 1) * winWidth), 0);
$(".rp_dsyp").hide();
        }
        read.totalPage2();
    },
    moveLeft: function() {
        $(".rp_tool_more,.rp_shadow,.rp_tool_bg,.rp_tool_other").fadeOut(300);
        read.transUtil(".rp_tool_top", 400, 0, 0);
        read.transUtil(".rp_sidebar", 400, 0, 0);
        read.transUtil(".rp_tool_bottom", 400, 0, 0);
        c = 0;

        if (r == 1) {
            page--;
            read.touchLeft();
            (page < 1) ? page = 1 : page = page;
            $(".rp_pageinfo").html(page + "/" + totalPage);
            p = page / totalPage;
            console.log(p);
        } else {
            read.preChapter('book');
        }
    },
    moveRight: function() {
        $(".rp_tool_more,.rp_shadow,.rp_tool_bg,.rp_tool_other").fadeOut(300);
        read.transUtil(".rp_tool_top", 400, 0, 0);
        read.transUtil(".rp_sidebar", 400, 0, 0);
        read.transUtil(".rp_tool_bottom", 400, 0, 0);
        c = 0;
        if ($(".rp_cover").size() == 0) {
            r = 1;
        }
        if (r == 0) {
            read.transUtil(".rp_cover", 400, -$(window).width(), 0);
            r = 1;
        } else {
            page++;
            read.touchRight();
            (page > totalPage) ? page = totalPage : page = page;
            $(".rp_pageinfo").html(page + "/" + totalPage);
            p = page / totalPage;
        }
    },
    daynightInit: function() {
 /*UESFTL-5075 sxf 20150918 wap免费体系 新增夜间广告颜色 */
        /*var dayORnight = getCookie("dayORnight");
        if (dayORnight == "night") {
            $(".rp_link_bthy").addClass("rp_link_bthy_hy");
            $(".rp_link_bthy").html("<span class='img'></span>白天");
            $("body,.read_text, .rp_head,.rp_cover2,.rp_foot").addClass("read_black");
            $(".popads .deletead").addClass("nighta");
        }*/
    },
    bookBgInit: function() {
        /*var bookBg = getCookie("bookBg");
        $("body,.read_text,.rp_head,.rp_cover2,.rp_foot").removeClass("bg_yellow bg_green bg_blue bg_white bg_black");
        if (bookBg == "" || bookBg == "bg_white") {
            $(".rp_color_box a").eq(0).addClass("on");
            $("body,.read_text,.rp_head,.rp_cover2,.rp_foot").addClass("bg_white")
        } else {
            $(".rp_tool_bg a").each(function() {
                if ($(this).attr("data-rel") == bookBg) {
                    $(this).addClass("on");
                    $("body,.read_text,.rp_head,.rp_cover2,.rp_foot").addClass(bookBg)
                }
            })
        }*/
    },
    fontInit: function() {
        //字体初始化
        sizeInfo = [{
            "size": 12,
            "lineHeight": 20
        }, {
            "size": 14,
            "lineHeight": 23
        }, {
            "size": 16,
            "lineHeight": 26
        }, {
            "size": 18,
            "lineHeight": 29
        }, {
            "size": 20,
            "lineHeight": 32
        }, {
            "size": 22,
            "lineHeight": 36
        }, {
            "size": 24,
            "lineHeight": 38
        }];
        sizeNo = 3;
        //如果Cookie中存储了字体缩放大小信息，则从Cookie中获取并做初始化 上线后由由FTL判断可删除
       /* var cookieSizeNo = getCookie("sizeNo");
        if (cookieSizeNo != "") {
            sizeNo = cookieSizeNo;
            $(".read_text").css({
                "font-size": sizeInfo[sizeNo].size + "px",
                "line-height": sizeInfo[sizeNo].lineHeight + "px"
            });
        }*/
    },
    fontChange: function() {
        sizeLength = sizeInfo.length;
        //字体放大
        $(".rp_link_fd").tap(function() {
            sizeNo++;
            if (sizeNo == sizeLength) {
                sizeNo = sizeLength - 1;
                read.showMessage('字体已放到最大');
            } else {

                if (sizeNo == sizeLength - 1) {
                    $(this).addClass('gray');
                    read.showMessage('字体已放到最大');
                } else {
                    $(".rp_link_fd,.rp_link_sx").removeClass('gray');
                    read.showMessage('字体放大');
                }
                $(".read_text ").css({
                    "font-size": sizeInfo[sizeNo].size + "px",
                    "line-height": sizeInfo[sizeNo].lineHeight + "px"
                });
                console.log(sizeNo);
                addCookie("sizeNo", sizeNo, 30 * 24);
                read.totalPage2();
            };
        });
        //字体缩小
        $(".rp_link_sx").tap(function() {
            sizeNo--;
            if (sizeNo < 0) {
                sizeNo = 0;
                read.showMessage('字体已缩到最小');
            } else {

                if (sizeNo == 0) {
                    $(this).addClass('gray');
                    read.showMessage('字体已缩到最小');
                } else {
                    $(".rp_link_fd,.rp_link_sx").removeClass('gray');
                    read.showMessage('字体缩小');
                }
                $(".read_text ").css({
                    "font-size": sizeInfo[sizeNo].size + "px",
                    "line-height": sizeInfo[sizeNo].lineHeight + "px"
                });
                console.log(sizeNo);
                addCookie("sizeNo", sizeNo, 30 * 24);
                read.totalPage2();
            };
        });
    },
    bookBgChange: function() {
        $(".rp_color_box a").tap(function() {
            $(".rp_color_box a").removeClass("on");
            $(this).addClass("on");
            $("body").removeClass("bg_yellow bg_green bg_blue bg_white bg_black");
            $("body").addClass($(this).attr("data-rel"));
            addCookie("bookBg", $(this).attr("data-rel"), 30 * 24)
        });
    },
    daynightChange: function(abc) {
        $(".rp_link_bthy").tap(function() {
            if ($(".read_black").size() == 0) {
                $("body").addClass("read_black");
                $(this).addClass("rp_link_bthy_hy");
                addCookie("dayORnight", "night", 30 * 24);
                $(".rp_link_bthy").html("<span class='img'></span>白天");
                $(".popads .deletead").addClass("nighta"); /*UESFTL-5075 sxf 20150918 wap免费体系 新增夜间广告颜色 */
                read.showMessage("已切换成夜间模式")
            } else {
                $("body").removeClass("read_black");
                $(this).removeClass("rp_link_bthy_hy");
                addCookie("dayORnight", "day", 30 * 24);
                $(".rp_link_bthy").html("<span class='img'></span>夜间");
                $(".popads .deletead").removeClass("nighta"); /*UESFTL-5075 沈霞菲 20150918 wap免费体系 新增白天广告颜色 */
                read.showMessage("已切换成白天模式")
            }
        });
    },

    pageFormat: function() {
        $(".rp_sidebar").width($(window).width()).height($(window).height());

        headHeight = $(".rp_head").height();
        winWidth = $(window).width();
        winHeight = $(window).height() - headHeight;
        $(".read_content,.read_text").height(winHeight);
        $(" .rp_tool_more,.rp_shadow,.rp_tool_bg,.rp_tool_other").hide();
        read.transUtil(".rp_tool_top", 400, 0, 0);
        read.transUtil(".rp_sidebar", 400, 0, 0);
        read.transUtil(".rp_tool_bottom", 400, 0, 0);
        $(".rp_s_back").hide();
        d = 0;
        c = 0;
        if (p > 0) {
            totalPage = Math.ceil(document.getElementById("read_text").scrollWidth / winWidth);
            page = Math.ceil(totalPage * p);
            $(".rp_pageinfo").html(page + "/" + totalPage);
            read.transUtil(".rp_cover", 400, -$(window).width(), 0);
            read.transUtil(".read_text", 0, -((page - 1) * winWidth), 0);
        }
    },
    pageFormat2: function() {
        $(".rp_cover3").width($(window).width() - 40).height($(window).height() - 36);
        var winWidth = $(window).width();
        $(" .rp_tool_more,.rp_shadow,.rp_tool_bg,.rp_tool_other").hide();
        read.transUtil(".rp_tool_top", 400, 0, 0);
        read.transUtil(".rp_sidebar", 400, 0, 0);
        read.transUtil(".rp_tool_bottom", 400, 0, 0);
        $(".rp_s_back").hide();
        c = 0;
        d = 0;
    },

    totalPage2: function(abc) {
        winWidth = $(window).width();
        totalPage = Math.ceil(document.getElementById("read_text").scrollWidth / winWidth);
        console.log(document.getElementById("read_text").scrollWidth+"|"+winWidth+"|"+document.getElementById("read_text").scrollWidth / winWidth);
        if(page>=totalPage){
            page=totalPage;
            read.transUtil(".read_text", 0, -((page - 1) * winWidth), 0);
        }else{
            read.transUtil(".rp_dsyp", 400, 0, 0);
        }
        $(".rp_pageinfo").html(page + "/" + totalPage);
    },

    transUtil: function(slt, duration, lenX, lenY) { //移动效果
        $(slt).css("-webkit-transition", "-webkit-transform " + duration + "ms ease");
        $(slt).css("-o-transition", "-o-transform " + duration + "ms ease");
        $(slt).css("-moz-transition", "-moz-transform " + duration + "ms ease");
        $(slt).css("-ms-transition", "-ms-transform " + duration + "ms ease");
        $(slt).css("transition", "transform " + duration + "ms ease");
        $(slt).css("-webkit-transform", "translate3d(" + lenX + "px, " + lenY + "px,0px)");
        $(slt).css("-moz-transform", "translate3d(" + lenX + "px, " + lenY + "px,0px)");
        $(slt).css("-o-transform", "translate3d(" + lenX + "px, " + lenY + "px,0px)");
        $(slt).css("-ms-transform", "translate3d(" + lenX + "px, " + lenY + "px,0px)");
        $(slt).css("transform", "translate3d(" + lenX + "px, " + lenY + "px,0px)");
    },
    parseOpts: function(defaults, opts) {
        if (opts && $.isPlainObject(opts)) {
            for (var key in defaults) {
                defaults[key] = typeof opts[key] === 'undefined' ? defaults[key] : opts[key]
            }
        }
        return defaults
    },
    showMessage: function(message, opts) {
        if ($(".p_message").size() == 0) {
            var messageHtml = $("<div class='p_message'>" + message + "</div>").appendTo("body");
            var defaultOpts = {
                fadeInTime: 0,
                fadeOutTime: 1000,
                showTime: 500,
                hideBack: function() {}
            };
            opts = read.parseOpts(defaultOpts, opts);
            messageHtml.show();
            read.dialogResize(messageHtml);
            setTimeout(function() {
                    $(messageHtml).animate({
                            opacity: '0'
                        },
                        opts.fadeOutTime, 'ease',
                        function() {
                            $(messageHtml).remove();
                            if (opts.hideBack && $.isFunction(opts.hideBack)) {
                                opts.hideBack.call()
                            }
                        })
                },
                opts.fadeInTime + opts.showTime);
            return messageHtml;
        }
    },
    dialogResize: function(slt) {
        read.setPosition(slt, 0.5, 0.4);
    },
    setPosition: function(slt, x, y) {
        var px = x || 0.5;
        var py = y || 0.4;
        $(slt).each(function(index, element) {
            var dialogWidth = $(this).width();
            var dialogHeight = $(this).height();
            var freeHeight = $(window).height() - dialogHeight;
            if (freeHeight < 0) {
                freeHeight = 0
            }
            var dialogTop = freeHeight * py;
            var dialogLeft = ($(window).width() - dialogWidth) * px;
            $(this).css({
                top: dialogTop,
                left: dialogLeft
            })
        })
    },
    showOver: function(_zindex) {
        var bodyHeight = $("body").height();
        var bodyWidth = $("body").width();
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var height = bodyHeight > windowHeight ? bodyHeight : windowHeight;
        var width = bodyWidth > windowWidth ? bodyWidth : windowWidth;
        _zindex = _zindex || "";
        $('<div class="ui_overlay' + _zindex + '"></div>').appendTo("body").css({
            "height": height,
            "width": width
        })
    },
    removeOver: function(_zindex) {
        _zindex = _zindex || "";
        $('.ui_overlay' + _zindex).remove();
    },
    closeDialog: function(dialogId) {
        read.removeOver();
        $(dialogId).hide();
    },
    preChapter: function(cnttypeFlag) {
        if (preContentUrl == "") {
            read.showMessage("当前是第一章！")
        } else {
            window.location.href = preContentUrl
        }
    },
    nextChapter: function(cnttypeFlag) {
        if (nextContentUrl == "") {
            read.showMessage("当前已是最后一章！")
        } else {
            if (isFirstTimeNextChapter == 0) {
                window.location.href = nextContentUrl;
                /*$("#nextPageUrl").on("tap",);*/
                isFirstTimeNextChapter = 1;
            }
        }
    }
}
read.readInit();

function addCookie(key, value, expiresHours) {
    var cookieString = key + "=" + escape(value);
    if (expiresHours > 0) {
        var date = new Date();
        date.setTime(date.getTime() + expiresHours * 3600 * 1000);
        cookieString = cookieString + ";expires=" + date.toUTCString() + ";path=/"
    }
    document.cookie = cookieString;
}
function getCookie(key) {
    var strCookie = document.cookie;
    var arrayCookie = strCookie.split(";");
    var numCookies = arrayCookie.length;
    for (var i = 0; i < numCookies; i++) {
        var tmpKeyValue = arrayCookie[i].split("=");
        if (key == tmpKeyValue[0].trim()) return unescape(tmpKeyValue[1])
    }
    return ""
}

$(function() {
    if ($(".read_content").size() != 0) {
        var mlWidth = $(".dragBar").width() + 0;
        if (vendor === 'ms') {
            $("#rp_action .rp_center,.rp_shadow,.rp_middle").click(function() {
                var winWidth = $(window).width();
                $(".rp_tool_more,.rp_shadow").fadeToggle(300);
                read.transUtil(".rp_tool_top", 400, 0, $(".rp_tool_top").height() - 1);
                read.transUtil(".rp_sidebar", 400, mlWidth, 0);
                read.transUtil(".rp_tool_bottom", 400, 0, "-" + $(".rp_tool_bottom").height());
                $(".rp_tool_bg,.rp_tool_other").fadeOut(300);
                $(".rp_link_bg").removeClass("on")
            });
            $(".rp_link_bg").tap(function() {
                $(".rp_tool_other").fadeOut(300);
                $(".rp_tool_bg").fadeToggle(300);
                $(this).toggleClass("on")
            });
            $(".rp_link_more").tap(function() {
                $(".rp_tool_bg").fadeOut(300);
                $(".rp_tool_other").fadeToggle(300);
                $(this).toggleClass("on")
            });
        } else {
            $("#rp_action .rp_center,.rp_shadow,.rp_middle").click(function() {
                var winWidth = $(window).width();
                $(" .rp_tool_more,.rp_shadow").fadeToggle(300);
                if (c == 0) {
                    read.transUtil(".rp_tool_top", 400, 0, $(".rp_tool_top").height() - 1);
                    read.transUtil(".rp_sidebar", 400, mlWidth, 0);
                    read.transUtil(".rp_tool_bottom", 400, 0, "-" + $(".rp_tool_bottom").height());
                    c = 1
                } else {
                    read.transUtil(".rp_tool_top", 400, 0, 0);
                    read.transUtil(".rp_sidebar", 400, 0, 0);
                    read.transUtil(".rp_tool_bottom", 400, 0, 0);
                    c = 0
                }
                $(".rp_tool_bg,.rp_tool_other").fadeOut(300);
                $(".rp_link_bg").removeClass("on")
            });
            $(".rp_link_bg").tap(function() {
                $(".rp_tool_other").fadeOut(300);
                $(".rp_tool_bg").fadeToggle(300);
                $(this).toggleClass("on")
            });
            $(".rp_link_more").tap(function() {
                $(".rp_tool_bg").fadeOut(300);
                $(".rp_tool_other").fadeToggle(300);
                $(this).toggleClass("on")
            });
        }



        var m = 1;
        var s1 = 1;
        var s2 = 1;
        var mySwiper = "";


        var mySwiper = new Swiper('.swiper-container', {
            paginationClickable: true,
            slidesPerView: 'auto',
            mode: 'vertical',
            freeMode: true,
            watchActiveIndex: true,
            onSlideReset: function() {


                var firstSlide = mySwiper.getFirstSlide(); //获取第一个slide
                var firstclass = $(firstSlide).attr("class");
                if (firstclass == "swiper-slide swiper-slide-visible swiper-slide-active") {
                    var dqpage = $("#slpage").attr("value");
                    //下拉加载
                    slybnum = slybnum + 1;
                    var stddload = $("#ddload").html();
                    if (slybnum == 1) {
                        if (dqpage >= 2 && stddload != "" && stddload != "null" && xlyb == 0) {
                            var newSlide = mySwiper.createSlide('<span class="orange" id="ddload">还有精彩章节正在加载中... </span>', 'swiper-slide', 'div');
                            mySwiper.insertSlideAfter(-1, newSlide);
                            xlyb = xlyb + 1;
                        }
                        var sumpage = $("#sunpage").attr("value");
                        var befindex = parseInt(dqpage) - 1;
                        if (befindex > 0) {
                            setTimeout(function() {
                                updownloadzj(mySwiper, befindex, "down");
                            }, 1000);
                            $("#slpage").attr("value", befindex);
                        }
                    }


                } else {
                    var sumpage = $("#sunpage").attr("value");
                    var dqpage = $("#page").attr("value");
                    var stddload2 = $("#ddload2").html();
                    //上拉加载更多
                    if (dqpage != sumpage && stddload2 != "" && stddload2 != "null" && slyb == 0) {
                        var newSlide = mySwiper.createSlide('<span class="orange" id="ddload2">还有精彩章节正在加载中... </span>', 'swiper-slide', 'div');
                        var slideNum = $(".swiper-slide").size();
                        mySwiper.insertSlideAfter(slideNum, newSlide);
                        slyb = slyb + 1;
                    }
                    var dqindex = $("#chapterSort").attr("value");
                    var nextpage = parseInt(dqpage) + 1;
                    if (nextpage <= parseInt(sumpage)) {
                        setTimeout(function() {
                            updownloadzj(mySwiper, nextpage, "up");
                        }, 1000);
                        $("#page").attr("value", nextpage);
                    }
                    /*if((nextpage-1)==parseInt(sumpage) && m==1){
        setTimeout(function(){mySwiper.removeLastSlide();},1000);
        m=m+1;
        }*/
                }


            },
            scrollbar: {
                container: '.swiper-scrollbar',
                draggable: false,
            }
        })

        var loandcs = 0;

        $(".rp_sidebar").click(function() {
            if (d == 1) {
                read.transUtil(".rp_sidebar", 400, mlWidth, 0);
                d = 0;
                $(".rp_s_back").fadeOut(400);
                $(".rp_sidebar").css("zIndex", "101");
            }
        });

        $(".rp_link_ml").click(function(e) {
            e.stopPropagation();
            var winWidth = $(window).width();
            if (d == 0) {
                read.transUtil(".rp_sidebar", 400, winWidth, 0);
                d = 1;
                $(".rp_s_back").fadeIn(400);
                $(".rp_tool_more,.rp_shadow,.rp_tool_bg,.rp_tool_other").fadeOut(300);
                $(".rp_sidebar").css("zIndex", "999");
                $(".dragBar").show();
            } else {
                read.transUtil(".rp_sidebar", 400, mlWidth, 0);
                d = 0;
                $(".rp_s_back").fadeOut(400);
                $(".rp_sidebar").css("zIndex", "101");
                $(".dragBar").show();
            }
            if (loandcs == 0) {
                mySwiper.appendSlide('<div class="swiper-slide"><span class="orange">还有精彩章节正在加载中... </span></div>', 'swiper-slide', 'div');
                //初次加载章节
                var dqindex = $("#chapterSort").attr("value");
                var sumpage = $("#sunpage").attr("value");
                var dqpage = $("#page").attr("value");
                var dqxspage1 = $("#slpage").attr("value");

                var dqpage1 = 1;
                var dqpage2 = 1;
                //加载下一页
                if (parseInt(dqindex) % 20 != "1") {
                    dqpage1 = parseInt(parseInt(dqpage) + 1);
                    if (dqpage1 <= parseInt(sumpage)) {
                        ybloadzj(mySwiper, dqpage1, 1);;
                    }
                }
                //当前第几页
                if (parseInt(dqindex) % 20 != 0) {
                    dqpage2 = parseInt(dqindex / 20 + 1);
                } else {
                    dqpage2 = parseInt(dqindex / 20);
                }
                setTimeout(function() {
                    ybloadzj(mySwiper, dqpage2, 2);
                }, 200);

                //删除加载
                /*if(parseInt(dqpage2)==sumpage && s1==1){
    mySwiper.removeLastSlide();
        s1=s1+1;
    }
    if(parseInt(dqpage2)==1 && s2==1 ){
    mySwiper.removeSlide(0)
        s2=s2+1;
    }*/

                if (parseInt(dqindex) % 20 != "1") {
                    if (dqpage1 > parseInt(sumpage)) {
                        $("#page").attr("value", dqpage1 - 1);
                    } else {
                        $("#page").attr("value", dqpage1);
                    }
                } else {
                    $("#page").attr("value", dqpage2);
                }
                loandcs = loandcs + 1;
            } else {
                var dqindex = $("#chapterSort").attr("value");
                var dqpaget = parseInt(dqindex / 20);
                if (parseInt(dqindex % 20) == 0) {
                    var dqpage = dqpaget;
                } else {
                    var dqpage = dqpaget + 1;
                }
                if (dqindex % 20 == 0 && dqindex >= 20) {
                    var index = dqindex - 20 * (dqpaget - 1);
                } else {
                    var index = dqindex - 20 * dqpaget;
                }
                var sjpage = $("#dqpage").attr("value");
                var indexdw = (dqpage - sjpage) * 20 + index;
                mySwiper.swipeTo(indexdw - 1, 0, false);
            }
        })
    }
});



var s = 1;

function ybloadzj(mySwiper, page, pd) {
    var dqindex = $("#chapterSort").attr("value");
    var chapterid = $("#chapterid").attr("value");
    var bookid = $("#bookid").attr("value");
    var url = "http://wap.cmread.com/r/t/ybzjdata.jsp?vt=3&page=" + page + "&cid=" + chapterid + "&bid=" + bookid;
    $.ajax({
        url: url,
        success: function(data) {
            var startidex = data.indexOf('<anyce>');
            var endindex = data.indexOf('</anyce>');
            var str = data.substring(startidex + 7, endindex);
            var arr = str.split(",");
            for (i = 0; i < arr.length; i++) {


                var dqpage = parseInt(dqindex / 20);
                if (dqindex % 20 == 0 && dqindex >= 20) {
                    var index = dqindex - 20 * (dqpage - 1);
                } else {
                    var index = dqindex - 20 * dqpage;
                }
                var str = arr[i];
                if (pd == 2) {
                    if (i == index - 1) {
                        str = str.replace('class="t"', 'class="curr"');
                    }
                }
                var newSlide = mySwiper.createSlide(str, 'swiper-slide', 'div');
                var slideNum = $(".swiper-slide").size();
                var sumpage = $("#sunpage").attr("value");
                var slpage = $("#slpage").attr("value");
                if (page > 1) {
                    mySwiper.insertSlideAfter(i, newSlide);
                    if (pd == 2) {
                        mySwiper.swipeTo(index - 1, 0, false);
                    }
                } else {
                    mySwiper.insertSlideAfter(i, newSlide);
                    if (pd == 2) {
                        mySwiper.swipeTo(index - 1, 0, false);
                    }
                }
            }
            if (pd == 2) {
                mySwiper.removeSlide(0);
            }
        }
    });
}



//上拉或下拉加载
var move = 0;

function updownloadzj(mySwiper, page, pd) {

    if (move == 0) {
        move = 1;

        var dqindex = $("#chapterSort").attr("value");
        var chapterid = $("#chapterid").attr("value");
        var dqpage1 = $("#dqpage").attr("value");
        var dqpage2 = $("#page").attr("value");
        var bookid = $("#bookid").attr("value");
        var url = "http://wap.cmread.com/r/t/ybzjdata.jsp?vt=3&page=" + page + "&cid=" + chapterid + "&bid=" + bookid;
        console.log(move);
        $.ajax({
            url: url,
            success: function(data) {
                var startidex = data.indexOf('<anyce>');
                var endindex = data.indexOf('</anyce>');
                var str = data.substring(startidex + 7, endindex);
                var arr = str.split(",");
                var index = 0;
                if (dqindex % 20 == 0 && dqindex >= 20) {
                    index = dqindex - 20 * (dqpage - 1);
                } else {
                    index = dqindex - 20 * dqpage;
                }
                for (i = 0; i < arr.length; i++) {
                    var newSlide = mySwiper.createSlide(arr[i], 'swiper-slide', 'div');
                    if (pd == "down") {
                        var slideNum = $(".swiper-slide").size();
                        mySwiper.insertSlideAfter(i, newSlide);
                        var dqpage = parseInt(dqindex / 20);
                        $("#slpage").attr("value", page);
                    } else if (pd == "up") {
                        var slideNum = $(".swiper-slide").size();
                        mySwiper.insertSlideAfter(slideNum - 3, newSlide);
                        $("#page").attr("value", page);
                    }
                }

                if (pd == "down") {
                    mySwiper.removeSlide(0)
                    var spage = $("#slpage").attr("value");
                    var t = parseInt(parseInt(dqpage1) - spage);
                    mySwiper.swipeTo(t * 20, 0, false);
                    $("#dqpage").attr("value", parseInt(parseInt(dqpage1) - 1));
                    xlyb = 0;
                } else {
                    mySwiper.removeLastSlide();
                    slyb = 0;
                }
                slybnum = 0;
                move = 0;
                console.log(move);
            }
        });

    }
}


var xmlhttp;

function createXMLHttpRequest() {
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
}
/* 收藏*/

function ajaxChange(url) {
    xmlhttp = null;
    createXMLHttpRequest();

    if (xmlhttp != null) {
        xmlhttp.onreadystatechange = store;
        xmlhttp.open("POST", url, true);
        xmlhttp.send(null);
    }

}

function store() {
    if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {

            var responseHtml = xmlhttp.responseText;
            if (responseHtml != undefined && responseHtml != "") {
                //var b=responseHtml.indexOf('<div class="promptBox">');
                // var e=responseHtml.indexOf('<br/>            <input type="hidden"');
                //var message=responseHtml.substring(b+23,e);



                var b = responseHtml.indexOf('class="iconpic" />');
                var e = responseHtml.indexOf('</div>        <input type="hidden"');
                var message = responseHtml.substring(b + 23, e);
                console.log(message);
                read.showMessage(message);

            }
        }
    }
}
//加书签

function ajaxMark(url) {
    xmlhttp = null;
    createXMLHttpRequest();

    if (xmlhttp != null) {
        xmlhttp.onreadystatechange = bookMark;
        xmlhttp.open("POST", url, true);
        xmlhttp.send(null);
    }

}

function bookMark() {
    if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {

            var responseHtml = xmlhttp.responseText;
            if (responseHtml != undefined && responseHtml != "") {
                var b = responseHtml.indexOf('<p id="et10000_01_00">');
                var e = responseHtml.indexOf("</p>");
                var message = responseHtml.substring(b + 22, e);
                console.log(message);
                read.showMessage(message);

            }
        }
    }
}

$("#rlfy").live("tap", function() {
    var url = $("#rlfy").attr("url");
    window.location.href = url;
    addCookie("readMode", "2", 30 * 24);
    addCookie("isFirstReadTD", "0", 30 * 24);
});
$("#updownfy").live("tap", function() {
    var url = $("#updownfy").attr("url");
    window.location.href = url;
    addCookie("readMode", "1", 30 * 24);
    addCookie("isFirstReadLR", "0", 30 * 24);
});

$(function() {
    var readmode = $("#readmode").attr("value");
    if (readmode == "1") {
        addCookie("isFirstReadTD", "0", 30 * 24);
    } else {
        addCookie("isFirstReadLR", "0", 30 * 24);
    }
});


// UESFTL-5075 沈霞菲 20150918 wap免费体系新增脚本  start 
$(".ads").live("tap", function() {
    $(".popads").hide();
});
// UESFTL-5075 沈霞菲 20150918 wap免费体系新增脚本  end