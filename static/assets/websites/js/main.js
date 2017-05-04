$(document).ready( function() {
	$(".menu-language .btn-custom-header").click(function(){
        $("#choose_language").val($(this).attr("tmp"));
        $("#language_form").submit();
    });


    $('ul.nav li.dropdown').click(function() {
    	alert('afsa');
		$(this).find('.dropdown-menu').stop(true, true).delay(0).fadeIn();
		$('#menu-caret').addClass('glyphicon-chevron-up');
		$('#menu-caret').removeClass('glyphicon-chevron-down');
	}, function() {
		$(this).find('.dropdown-menu').stop(true, true).delay(0).fadeOut();
		$('#menu-caret').addClass('glyphicon-chevron-down');
		$('#menu-caret').removeClass('glyphicon-chevron-up');
	}); 
});