import { Component, OnInit } from '@angular/core';

import { PromotionType } from '../../../shared/class/promotion-type';
import { ActivatedRoute, Router } from '@angular/router';

import { PromotionTypeService } from '../../../shared/services/promotion-type.service';

@Component({
  selector: 'app-promotion-type-list',
  templateUrl: './promotion-type-list.component.html',
  styleUrls: ['./promotion-type-list.component.css']
})
export class PromotionTypeListComponent implements OnInit {

	proTypes: PromotionType[];

  	constructor(
  		private promotionTypeService: PromotionTypeService,
        private router: Router,
  		) 
  	{ }

  	ngOnInit() {
        /* 
            Call function Get all PromotionType
            @author: Trangle
        */   
  		this.getAllPromotionType();
  	}

    /*
        Get All Promotion Type
        Call servive promotion_type
        @author: TrangLe
     */
  	getAllPromotionType() {
  		this.promotionTypeService.getAllPromotionsType().subscribe(
  			(result) => {
                this.proTypes = result;
            },
            (error) => {
                this.router.navigate(['/error', { message: error.json().message }])
            }
		)
  	}

}
