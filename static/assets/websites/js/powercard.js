var show_num = 5,
    view_more = 5;
var show_more_vi = 'XEM ĐẦY ĐỦ',
	show_more_en = 'SHOW MORE';
var show_less_vi = 'THU GỌN',
	show_less_en = 'SHOW LESS';


function viewMore() {
    var size_list = $(".faqs-section .faq-detail").length;
    $('.faqs-section .faq-detail:lt('+show_num+')').show();
    if(show_num >= size_list) {
        $(".btn-view-more").hide();
    }
}

$(document).ready( function() {
	$(".faq-detail").css('display','none');

    viewMore();

    $(".btn-view-more").click(function() {
        show_num += view_more;
        viewMore();
    });

	function toggleIcon(e) {
	    $(e.target)
	        .prev('.panel-heading')
	        .find(".more-less")
	        .toggleClass('fa-chevron-circle-down fa-chevron-circle-up');
	}
	$('.panel-group').on('hidden.bs.collapse', toggleIcon);
	$('.panel-group').on('shown.bs.collapse', toggleIcon);
	$( ".card-description" ).each(function(  ) {
	  	if ( $(this ).height() > 200 ) {
	  		$( this ).addClass("height-limit")
	  		$( this ).parent().parent().find(".card-div-bottom").removeClass("hidden");
	  	}
	});
	var show_more,
		show_less;
	if(lang_code == "en") {
		show_more = show_more_en;
		show_less = show_less_en;
	} else {
		show_more = show_more_vi;
		show_less = show_less_vi;
	}
	$(".view-full").click(function(){
		var powercard_content = $(this).parent().parent().find(".card-description");
		if($(powercard_content).hasClass("height-limit")) {
			$(powercard_content).removeClass("height-limit");
			$(this).html(show_less + '<br> <i class="glyphicon glyphicon-chevron-up">');
		} else {
			$(powercard_content).addClass("height-limit");
			$(this).html(show_more + '<br> <i class="glyphicon glyphicon-chevron-down">');
		}
	});
});