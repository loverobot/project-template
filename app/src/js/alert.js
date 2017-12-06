;
(function(window, $, document, undefined) {
    //'use strict'
    var animate = function(param) {
        var _this = this;
        $(this).parents('.dialogs-wrap').removeClass(function() {
                return $(this).attr('class').replace(/dialogs-wrap/g, '');
            })
            .addClass(param + ' animated')
            .on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                function() {
                    $(_this).parents('.dialogs-fixed').remove();
                });
    }
    var dialogs = {};
    dialogs.Comment = function(data) {
        var defalut = {
            "animate": 'animated zoomIn',
            "rmCloseBtn": false,
            "title": '',
            "content": '内容部分',
            "cancleBtn": false,
            "cancleCallBack": function() {},
            "confirmBtn": false,
            "confirmCallBack": function() {}
        }
        var datainfo = $.extend({}, defalut, data);
        this.dialogsFixed = '<div class="dialogs-fixed"></div>';
        this.dialogsWrap = '<div class="dialogs-wrap ' + datainfo.animate + '"></div>';
        /*头部*/
        this.title = datainfo.title ? '<h3>' + datainfo.title + '</h3>' : "";
        this.dialogHead = '<div class="dialog-head"></div>';
        this.dialogClose = datainfo.rmCloseBtn ? "" : '<div class="dialog-close-btn"></div>';
        /*内容部分*/

        this.dialogBody = '<div class="dialog-body">' + datainfo.content + '</div>';
        /*底部*/
        this.cancleBtn = datainfo.cancleBtn ? '<button class="cancle-btn">' + datainfo.cancleBtn + '</button>' : false;
        this.confirmBtn = datainfo.confirmBtn ? '<button class="confirm-btn">' + datainfo.confirmBtn + '</button>' : false;
        this.dialogFooter = '<div class="dialog-footer"></div>';
    };
    dialogs.Comment.prototype = {
        init: function(data) {
            var $dialogClose = $(this.dialogClose);
            var $dialogHead = $(this.dialogHead).append($dialogClose).append(this.title);
            var $dialogBody = $(this.dialogBody);
            var $cancleBtn = $(this.cancleBtn);
            var $confirmBtn = $(this.confirmBtn);
            var $dialogFooter = $(this.dialogFooter).append($cancleBtn).append($confirmBtn);
            var $dialogsWrap = $(this.dialogsWrap).append($dialogHead).append($dialogBody).append($dialogFooter);
            var $dialogsFixed = $(this.dialogsFixed).append($dialogsWrap)
            $('body').append($dialogsFixed);
            this.delEvent($dialogClose);
            if ($cancleBtn) {
                this.cancleEvent($cancleBtn, data.cancleCallBack);
            }
            if ($confirmBtn) {
                this.successEvent($confirmBtn, data.confirmCallBack);
            }
        },
        delEvent: function(ele) {
            $(ele).on('click', function() {
                animate.call(this, 'zoomOut');
            })
        },
        cancleEvent: function(ele, callback) {
            $(ele).click(function() {
                callback();
            })
        },
        successEvent: function(ele, callback) {
            $(ele).click(function() {
                callback();
            })
        }
    }

    dialogs.Alert = function(data) {
        dialogs.Comment.call(this, data);
        this.init(data);
    }
    dialogs.Alert.prototype = new dialogs.Comment();
    window.Dialogs = {
        "Alert": function(data) {
            new dialogs.Alert(data);
        }
    }
})(window, jQuery, document);

/*弹框提示html代码*/
/*<div class="dialogs-fixed">
    <div class="dialogs-wrap">
        <div class="dialog-head">
            <h3 class="title">
                title content
            </h3>
            <div class="dialog-close-btn">
                 
            </div>
        </div>
        <div class="dialog-body">
            Bootstrap相关优质项目推荐
        </div>
        <div class="dialog-footer">
            <button>btn1</button>
            <button>btn2</button>
        </div>
    </div>
</div>*/