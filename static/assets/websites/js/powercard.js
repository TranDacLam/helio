$(document).ready( function() {
	function toggleIcon(e) {
	    $(e.target)
	        .prev('.panel-heading')
	        .find(".more-less")
	        .toggleClass('fa-chevron-circle-down fa-chevron-circle-up');
	}
	$('.panel-group').on('hidden.bs.collapse', toggleIcon);
	$('.panel-group').on('shown.bs.collapse', toggleIcon);
	$( ".powercard-content" ).each(function(  ) {
	  	if ( $(this ).height() > 400 ) {
	  		$( this ).addClass("height-limit")
	  		$( this ).parent().find(".card-div-bottom").removeClass("hidden");
	  	}
	});
	$(".view-full").click(function(){
		var powercard_content = $(this).parent().parent().find(".powercard-content");
		if($(powercard_content).hasClass("height-limit")) {
			$(powercard_content).removeClass("height-limit");
			$(this).html('THU GỌN <br> <i class="glyphicon glyphicon-chevron-up">');
		} else {
			$(powercard_content).addClass("height-limit");
			$(this).html('XEM ĐẦY ĐỦ <br> <i class="glyphicon glyphicon-chevron-down">');
		}
	});
});