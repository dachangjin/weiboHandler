
// @description  微博批量操作，自动翻页，刷新即可停止
// @version      1.0.0
// @author       WangWei
// @email        309096092@qq.com

'use strict';


/**
 * type说明
 * 0:直接删除
 * 1:改为公开类型
 * 2:改为粉丝可见类型
 * 3:改为好友圈可见类型
 * 4:改为仅自己可见类型
 */

var type = 3;
var timeInterval = 1000;//每次调用间隔为1000毫秒，间隔太小可能造成系统繁忙，导致后面大量操作都处于系统繁忙
var deleteIfFail = false;// 操作失败是否删除,否则跳过该条。false为跳过，true为删除

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

var s = document.createElement('script');

var blackList = [];

s.setAttribute(

    'src',

    'https://lib.sinaapp.com/js/jquery/2.0.3/jquery-2.0.3.min.js'

);

s.onload = function() {
    start();
};

function start() {
    setInterval(function() {
        handleItem();
    },timeInterval);
}


// function deleteItem() {
//     var button = $('a[action-type="feed_list_delete"]');
//     if (button[0]) {
//         button[0].click();
//         $('a[action-type="ok"]')[0].click();
//     } else {
//         scrollToBottomAndStepToNext();
//     }
// }

function handleItem() {

    var visibleType = '';
    var handleType = '';
    switch(type) {
        case 1:
            visibleType = 'cur_visible=0';
            handleType = 'visible=0';
            break;
        case 2:
            visibleType = 'cur_visible=10';
            handleType = 'visible=10';
            break;
        case 3:
            visibleType = 'cur_visible=6';
            handleType = 'visible=2';
            break;
        case 4:
            visibleType = 'cur_visible=1';
            handleType = 'visible=1';
            break;
        default:
    }

    var selectorStr = 'div[action-type=feed_list_item][action-data!="' + visibleType + '"]';
    if (type == 0) selectorStr = 'div[action-type=feed_list_item]';
    var items = $(selectorStr);    
    var item = items[0];
    if (item) {
        var mid = $(item).attr('mid');
        //修改失败对话框
        var dialog = $('.W_layer.W_translateZ')[0];
        if (dialog) {
            $('.W_layer.W_translateZ a[action-type="ok"]')[0].click();
            blackList.push(mid);
        }
    
        if (!blackList.contains(mid)) {
            var findSelector = 'a[action-data="' + handleType + '"]';
            if (type == 0) {
                findSelector = 'a[action-type="feed_list_delete"]';
            }
            var button = $(item).find(findSelector);
            if (button[0]) {
                button[0].click();
                $('a[action-type="ok"]')[0].click();
                if (items.length < 5) {
                    scrollToBottomAndStepToNext();
                }
            } else {
                scrollToBottomAndStepToNext();
            }
        } else {
            // $(item).attr('action-data','cur_visible=1');
            if (deleteIfFail) {
                //修改失败，删除
                var button = $(item).find('a[action-type="feed_list_delete"]');
                if (button[0]) {
                    button[0].click();
                    $('a[action-type="ok"]')[0].click();
                } else {
                    scrollToBottomAndStepToNext();
                }
            } else {
                //跳过
                $(item).attr('action-data',visibleType);

            }
        }
    } else {
        scrollToBottomAndStepToNext();
    }
}


function scrollToBottomAndStepToNext() {
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    var next = $('.page.next.S_txt1.S_line1');
    if (next[0]) {
        next[0].click();
    }
}

document.head.appendChild(s);