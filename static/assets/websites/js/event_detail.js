$(document).ready(function(){
	var start_time = $(this).find(".start_datetime").text();
    $('.countdown.future-class').countdown(start_time, function(event) {
        $(this).find(".days").find(".current").text(event.strftime('%D'));
        $(this).find(".hours").find(".current").text(event.strftime('%H'));
        $(this).find(".minutes").find(".current").text(event.strftime('%M'));
        $(this).find(".seconds").find(".current").text(event.strftime('%S'));
    });
});