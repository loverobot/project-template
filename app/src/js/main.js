;
(function(window, $, document, undefined) {
    'use strict'
    $('.nav-sidebar li,.navbar-nav li').on('click', function() {
        $(this).addClass('active').siblings().removeClass('active').children('ul').hide();
        $(this).children('ul').show();
    });
    var mySwiper = new Swiper('.swiper-container', {
    	effect : 'fade',
        autoplay: 5000, //可选选项，自动滑动
        pagination: '.swiper-pagination',
        prevButton: '.swiper-button-prev',
        nextButton: '.swiper-button-next',
    })
    $('.close-btn').on('click',function(){
        var h = $(this).parent().height();
        var w = $(this).parent().width();
        console.log(h + ":" + w);
        $(this).parents('.temp-alert-wrap').hide();
    })
})(window, jQuery, document);