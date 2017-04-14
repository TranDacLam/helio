$(document).ready( function() {
    $('#myCarousel').carousel({
        interval:   4000
    });
    
    var clickEvent = false;
    $('#myCarousel').on('click', '.home-carousel a', function() {
            clickEvent = true;
            $('.home-carousel li').removeClass('active');
            $('.home-carousel li').removeClass('prev');
            $(this).parent().prev().addClass("prev");
            $(this).parent().addClass('active');        
    }).on('slid.bs.carousel', function(e) {
        if(!clickEvent) {
            var count = $('.home-carousel').children().length -1;
            var current = $('.home-carousel li.active');
            current.removeClass('active').next().addClass('active');
            $('.home-carousel li').removeClass('prev');
            current.addClass("prev");
            var id = parseInt(current.data('slide-to'));
            if(count == id) {
                $('.home-carousel li').first().addClass('active');    
            }
        }
        clickEvent = false;
    });

    $("div.game-section-menu>div.list-group>a").click(function(e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.game-section>div.game-section-content").removeClass("active");
        $("div.game-section>div.game-section-content").eq(index).addClass("active");
    });
});