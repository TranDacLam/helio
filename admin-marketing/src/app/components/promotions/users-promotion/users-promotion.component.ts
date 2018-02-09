import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PromotionService } from '../../../shared/services/promotion.service';
import { User } from '../../../shared/class/user';
import { Promotion } from '../../../shared/class/promotion';

@Component({
    selector: 'app-users-promotion',
    templateUrl: './users-promotion.component.html',
    styleUrls: ['./users-promotion.component.css']
})
export class UsersPromotionComponent implements OnInit {
	user_list_left: User[];
    user_list_right: User[] = [];

    promotion: Promotion;


    constructor(private route: ActivatedRoute, private promotionService: PromotionService) { }

    ngOnInit() {
    	this.getUsersPromotionDetail();
    }

    getUsersPromotionDetail(){

        const id = +this.route.snapshot.paramMap.get('id');

        this.promotionService.getUsersPromotionDetail(id).subscribe(data=> {
            this.promotion = data.promotion_detail;
            this.user_list_left = data.user_all;
            this.user_list_right = data.user_promotion;
        });
    }

    countChange(event) {
    	// console.log("tesst");
    	console.log(event);
	}

}
