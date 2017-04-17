$(document).ready( function() {
	$(".menu-language .btn-custom-header").click(function(){
        $("#choose_language").val($(this).attr("tmp"));
        $("#language_form").submit();
    });
});