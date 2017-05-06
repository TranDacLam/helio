var show_num = {},
    first_show =8,
    view_more = 8;

function viewMore (element) {
    var id = $(element).parent().attr("id");
    var size_list = $(element).find(".faq-detail").length;
    var show_lengh =  show_num[id];
    $(element).find('.faq-detail:lt('+show_lengh+')').show();
    if(show_lengh >= size_list) {
        $(element).find(".btn-view-more").hide();
    }
    show_num[id] = show_lengh;
}
function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('fa-chevron-circle-down fa-chevron-circle-up');
}
$(document).ready(function(){
    $(".faq-detail").css('display','none');

    $(".faqs_category:first").addClass('active');
    $(".faqs-content:first").addClass('active');

    $(".tab-content .tab-pane").each(function(){
        var id = $(this).attr("id");
        show_num[id] = first_show;
        viewMore($(this).find(".view-more-div"));
    });

    $(".btn-view-more").click(function() {
        var div_parent = $(this).parent().parent();
        var size_list = $(div_parent).find(".item-line").length;
        var id = $(div_parent).parent().attr("id");
        show_num[id] += view_more;
        viewMore(div_parent);
    });

    $('.panel-group').on('hidden.bs.collapse', toggleIcon);
    $('.panel-group').on('shown.bs.collapse', toggleIcon);
    $( ".card-description" ).each(function(  ) {
        if ( $(this ).height() > 200 ) {
            $( this ).addClass("height-limit")
            $( this ).parent().parent().find(".card-div-bottom").removeClass("hidden");
        }
    });
    $(".view-full").click(function(){
        var powercard_content = $(this).parent().parent().find(".card-description");
        if($(powercard_content).hasClass("height-limit")) {
            $(powercard_content).removeClass("height-limit");
            $(this).html('THU GỌN <br> <i class="glyphicon glyphicon-chevron-up">');
        } else {
            $(powercard_content).addClass("height-limit");
            $(this).html('XEM ĐẦY ĐỦ <br> <i class="glyphicon glyphicon-chevron-down">');
        }
    });    
});