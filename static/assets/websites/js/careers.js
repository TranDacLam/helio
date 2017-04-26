var show_num = 6,
    view_more = 6;

function viewMore() {
    var size_list = $(".careers-content .career-div").length;
    console.log(size_list);
    $('.careers-content .career-div:lt('+show_num+')').show();
    if(show_num >= size_list) {
    	console.log('2131313');
        $(".btn-view-more").parent().hide();
    }
}
$(document).ready(function(){
    $(".career-div").css('display','none');

    viewMore();

    $(".btn-view-more").click(function() {
        show_num += view_more;
        viewMore();
    });    
});