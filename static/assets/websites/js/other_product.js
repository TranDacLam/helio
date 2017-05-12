var show_num =5,
    view_more = 5;

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
});