var EventsFunction = (function ($) {
    var helio_events = function () {
        var _self = this;
        var show_num = {};
        var show_num = 4,
            view_more = 4;
        this.initElementPage = function() {
            _self.eventsCoursel();
            
            $(".countdown.future-class").each(function(){
                var start_time = $(this).find(".start_datetime").text();
                $(this).countdown(start_time, function(event) {
                    $(this).find(".days").find(".current").text(event.strftime('%D'));
                    $(this).find(".hours").find(".current").text(event.strftime('%H'));
                    $(this).find(".minutes").find(".current").text(event.strftime('%M'));
                    $(this).find(".seconds").find(".current").text(event.strftime('%S'));
                });
            });
        }

        this.initEventPage = function () {
            _self.viewMore();

            $(".btn-view-more").click(function() {
                show_num += view_more;
                _self.viewMore();
            });     
        }
        this.viewMore = function () {
            var size_list = $("#events_content .item-line").length;
            $('#events_content .item-line:lt('+show_num+')').show();
            if(show_num >= size_list) {
                $(".btn-view-more").hide();
            }
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
                var items_length = $(element).find('.item-flex').length;
                var max_items = 7;
                if(items_length < 7)  {
                    max_items = items_length;
                }

                $(element).flexslider({
                    animation: "slide",
                    animationSpeed: 400,
                    animationLoop: false,
                    itemWidth: 160,
                    itemMargin: 3,
                    minItems: 2, // use function to pull in initial value
                    maxItems: max_items, // use function to pull in initial value
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
    });
})(new EventsFunction(), jQuery);