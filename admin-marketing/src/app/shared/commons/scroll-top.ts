import { Injectable } from '@angular/core';

@Injectable()
export class ScrollTop {
    /*
        Function scrollTopFom(): creoll top when have validate
        @author: Lam
    */
    scrollTopFom(){
        $('html,body').animate({ scrollTop: $('.title').offset().top }, 'slow');
    }
}