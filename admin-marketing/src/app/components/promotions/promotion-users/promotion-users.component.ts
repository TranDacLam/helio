import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PromotionService } from '../../../shared/services/promotion.service';
import { User } from '../../../shared/class/user';
import { Promotion } from '../../../shared/class/promotion';

@Component({
    selector: 'app-promotion-users',
    templateUrl: './promotion-users.component.html',
    styleUrls: ['./promotion-users.component.css']
})
export class PromotionUsersComponent implements OnInit {
	user_list_left: User[];
    user_list_right: User[] = [];

    promotion: Promotion;


    constructor(private route: ActivatedRoute, private promotionService: PromotionService) { }

    ngOnInit() {
    	this.getPromotionUsersDetail();
    }

    getPromotionUsersDetail(){
        const id = +this.route.snapshot.paramMap.get('id');

        this.promotionService.getPromotionUsersDetail(id).subscribe(promotion=> {
            console.log(promotion.promotion_detail);
            this.user_list_left = promotion.user_all
            this.user_list_right = promotion.user_promotion
        });
    }

    countChange(event) {
    	console.log("tesst");
    	console.log(event);
	}

}
