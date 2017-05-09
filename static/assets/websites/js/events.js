var EventsFunction = (function ($) {
    var helio_events = function () {
        var _self = this;
        var show_num = {};
        var first_show = 4,
            view_more = 4;
        this.initElementPage = function() {
            $(".tab-content .tab-pane:first").addClass("active");
        }

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
        this.eventsCoursel = function() {
            $(".event-month:last").addClass("active");
            $(".events-list-by-month:last").addClass("active");
            
            $('.events-list-by-month').each(function() {
                $(this).find(".event-item:last").addClass("active");
            });

            $('.month-carousel').carousel({
                interval: false
            });
            _self.flexCoursel('.events-list-by-month.active .flexslider');
            $('.month-carousel').on('slide.bs.carousel', function (e) {
                if($(e.relatedTarget).attr('class') === 'item events-list-by-month') {
                    var indexFrom = $('.month-carousel>.carousel-inner>.item.active').index();
                    var indexTo = $(e.relatedTarget).index();
                    $('.event-month').eq(indexFrom).hide()
                    $('.event-month').eq(indexTo).show();

                    _self.flexCoursel($(e.relatedTarget).find('.flexslider'));
                }
            });
        }
        this.flexCoursel = function(element) {
            if(!$(element).hasClass("complete")) {
                $(element).flexslider({
                    animation: "slide",
                    animationSpeed: 400,
                    animationLoop: false,
                    itemWidth: 160,
                    itemMargin: 5,
                    minItems: 2, // use function to pull in initial value
                    maxItems: 7, // use function to pull in initial value
                });
                $(element).addClass("complete");
            }
        }
    }
    return helio_events;
})(jQuery);

(function (events, $) {
    $(document).ready(function(){
        events.initElementPage()
        events.initEventPage();
        events.eventsCoursel();
    });
})(new EventsFunction(), jQuery);