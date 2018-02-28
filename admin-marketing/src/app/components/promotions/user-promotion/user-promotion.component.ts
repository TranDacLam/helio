import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PromotionService } from '../../../shared/services/promotion.service';
import { User } from '../../../shared/class/user';
import { Promotion } from '../../../shared/class/promotion'

@Component({
  	selector: 'app-user-promotion',
  	templateUrl: './user-promotion.component.html',
  	styleUrls: ['./user-promotion.component.css'],
    providers: [
        PromotionService
    ]
})
export class UserPromotionComponent implements OnInit {

    promotion: Promotion;
	user_list_left: User[];
    user_list_right: User[];

    constructor(
        private route: ActivatedRoute, 
        private promotionService: PromotionService
    ) { }

    ngOnInit() {
    	this.getUsersPromotion();
    }

    getUsersPromotion(){
        const promotion_id = +this.route.snapshot.paramMap.get('id');

        this.promotionService.getUsersPromotion(promotion_id).subscribe(
            (data)=> {
                this.promotion = data.promotion_detail;
                this.user_list_left = data.user_all;
                this.user_list_right = data.user_promotion;
            }, 
            (error) => {
                console.log("Internal Server Error")
            });
    }

    updateUserPromotion(list_user_id) {
        const promotion_id = +this.route.snapshot.paramMap.get('id');

        this.promotionService.updateUserPromotion(promotion_id, list_user_id).subscribe(
            (data)=> {
                if (data.status == 204) {
                    console.log('Success');
                } else {
                    console.log('Error');
                }
            }, 
            (error) => {
                console.log("Internal Server Error")
            });
	}

}
