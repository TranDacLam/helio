var show_num =8,
    view_more = 8;

function viewMore() {
    var size_list = $(".faqs-section .faq-detail").length;
    $('.faqs-section .faq-detail:lt('+show_num+')').show();
    if(show_num >= size_list) {
        $(".btn-view-more").parent().parent().hide();
    }
}
$(document).ready(function(){
    $(".faq-detail").css('display','none');

    viewMore();

    $(".btn-view-more").click(function() {
        show_num += view_more;
        viewMore();
    });    
});