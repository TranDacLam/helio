import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { PromotionService } from '../../../shared/services/promotion.service';
import { User } from '../../../shared/class/user';
import { Promotion } from '../../../shared/class/promotion'
import { env } from '../../../../environments/environment';

declare var $: any;


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

    api_domain:string = "";

    notification_id: number;
    message_result: string = "";

    constructor(
        private router: Router,
        private route: ActivatedRoute, 
        private promotionService: PromotionService
    ) { 
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
    	this.getUsersPromotion();
    }

    getUsersPromotion(){
        const promotion_id = +this.route.snapshot.paramMap.get('id');

        this.promotionService.getUsersPromotion(promotion_id).subscribe(
            (data)=> {
                this.notification_id = data.notification_id;
                this.promotion = data.promotion_detail;
                this.user_list_left = data.user_all;
                this.user_list_right = data.user_promotion;
            }, 
            (error) => {
                this.router.navigate(['/error']);
            });
    }

    updateUserPromotion(list_user_id) {
        const promotion_id = +this.route.snapshot.paramMap.get('id');

        this.promotionService.updateUserPromotion(promotion_id, list_user_id).subscribe(
            (data)=> {
                if (data.status == 204) {
                    this.message_result = "Lưu thành công"
                } 
            }, 
            (error) => {
                this.router.navigate(['/error']);
            });
	}

    generator_QR_code(event , id: number) {
        let element = $(event.target);
        element.button('loading');
        this.promotionService.generator_QR_code(id).subscribe(
            (data) => {
                if(data.status == 200) {
                    let body = data.json(); 
                    this.promotion.QR_code = body.qr_code_url;
                }
                element.button('reset');
            }, 
            (error) => {
                this.router.navigate(['/error']);
            });
    }

}
