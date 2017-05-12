var show_num = 8,
    view_more = 3;

function viewMore() {
    var size_list = $(".photos-section .box").length;
    $('.photos-section .box:lt('+show_num+')').show();

    if(show_num >= size_list) {
        $(".box-view-more").hide();
    }
}
$(document).ready(function(){
    $(".box").css('display','none');

    viewMore();

    $(".box-view-more").click(function() {
        show_num += view_more;
        viewMore();
    });    
});