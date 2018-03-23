import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Promotion } from '../../../shared/class/promotion';
import { PromotionService } from '../../../shared/services/promotion.service';

@Component({
    selector: 'popup-edit-promotion',
    templateUrl: './popup-edit-promotion.component.html',
    styleUrls: ['./popup-edit-promotion.component.css'],
    providers: [PromotionService]
})
export class PopupEditPromotionComponent implements OnInit {

    /*
        Author: Lam
    */

    // Return 1 object to parent
    @Output() update_promotion: EventEmitter<Promotion> = new EventEmitter<Promotion>();

    promotion: Promotion;
    type_http = "put_popup"; // type http to form promotion component 

    lang = 'vi';

    constructor(
        private promotionService: PromotionService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
        this.getPromotion();
    }

    /*
        Function getNotification():
         + Get id from url path
         + Callback service function getNotification() by id
        Author: Lam
    */
    getPromotion(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.promotionService.getPromotionById(id, this.lang).subscribe(
            (data) => {
                this.promotion = data;
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

    /*
        Function updateNoti(): Get notification from component form-notification
        Author: Lam
    */
    updatePromotion(event){
        this.update_promotion.emit(event);
    }

}
