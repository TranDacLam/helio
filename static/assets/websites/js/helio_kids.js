var KidsFunction = (function ($) {
    var helio_kids = function () {
        var _self = this;
        var show_num = {};
        var first_show = 2,
            view_more = 2;
        this.initElementPage = function() {
            $(".kid-btn-group li:first").addClass("active");
            $(".tab-content .tab-pane:first").addClass("active");
        }

        this.initEventPage = function () {
            var url = window.location.href;
            var section_active = url.substring(url.lastIndexOf('/') + 2);
            $(".tab-content .tab-pane").each(function(){
                var id = $(this).attr("id");
                if(id === section_active) {
                    $(".kid-btn-group li").removeClass("active");
                    $(".tab-content .tab-pane").removeClass("active");
                    $(".tab-content ."+id).addClass("active");
                    $(".kid-btn-group ."+id).parent().addClass("active");
                }
                show_num[id] = first_show;
                _self.viewMore($(this).find(".view-more-div"));
            });
            $(".btn-view-more").click(function() {
                var div_parent = $(this).parent().parent();
                var id = $(div_parent).parent().attr("id");
                show_num[id] += view_more;
                _self.viewMore(div_parent);
            });
            $(".tab-content .tab-pane").each(function(){
                _self.initCoursel($(this).find('.carousel'));
            });
            $( window ).resize(function() {
                $(".tab-content .tab-pane").each(function(){
                    _self.initCoursel($(this).find('.carousel'));
                });
            });
        }
        this.initCoursel = function (element) {
            $(element).html($(element).parent().find('.carousel-tmp').html());
            var content_width = $(".container").width();
            var w = content_width * 0.675;
            var h = content_width > 1100 ? 500 : 350;
            $(element).carousel({
                carouselWidth: content_width,
                carouselHeight: 500,
                directionNav:true,    
                shadow:false, 
                frontWidth:w,
                frontHeight:h,
                hMargin: 0.3,
                vMargin: 0.8,
                short_description: true
            });
        }
        this.viewMore = function (element) {
            var id = $(element).parent().attr("id");
            var size_list = $(element).find(".item-line").length;
            var show_lengh =  show_num[id];
            $(element).find('.item-line:lt('+show_lengh+')').show();
            if(show_lengh >= size_list) {
                $(element).find(".btn-view-more").hide();
            }
            show_num[id] = show_lengh;
        }
    }
    return helio_kids;
})(jQuery);

(function (kids, $) {
    $(document).ready(function(){
        kids.initElementPage()
        kids.initEventPage();
    });
})(new KidsFunction(), jQuery);