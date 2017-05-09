var KidsFunction = (function ($) {
    var helio_kids = function () {
        var _self = this;
        var show_num = {};
        var first_show = 5,
            view_more = 5;

        this.initEventPage = function () {
            $(".tab-content .tab-pane").each(function(){
                var id = $(this).attr("id");
                show_num[id] = first_show;
                _self.viewMore($(this).find(".view-more-div"));
            });
            $(".btn-view-more").click(function() {
                var div_parent = $(this).parent().parent();
                var id = $(div_parent).parent().attr("id");
                show_num[id] += view_more;
                _self.viewMore(div_parent);
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
        kids.initEventPage();
    });
})(new KidsFunction(), jQuery);