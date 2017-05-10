$(document).ready(function () {
    function check_if_in_view() {
        var window_height = $(window).height();
        var window_top_position = $(window).scrollTop();
        var window_bottom_position = (window_top_position + window_height);

        $.each($('.animation-element'), function () {
            var $element = $(this);
            var element_height = $element.outerHeight();
            var element_top_position = $element.offset().top;
            var element_bottom_position = (element_top_position + element_height);


            if (window_top_position >= element_top_position - Math.ceil((($(window).height() * 0.65 ) * 0.35) * 2) && window_top_position < element_top_position + element_height - Math.ceil((($(window).height() * 0.65 ) * 0.35) * 2)) {
                $element.addClass('animated');
            } else {
                $element.removeClass('animated');
            }
        });
    }
    $(window).on('scroll resize', check_if_in_view);
    check_if_in_view();
});