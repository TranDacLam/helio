import { Component, OnInit } from '@angular/core';

import { PromotionType } from '../../../shared/class/promotion-type';

import { PromotionTypeService } from '../../../shared/services/promotion-type.service';

@Component({
  selector: 'app-promotion-type-list',
  templateUrl: './promotion-type-list.component.html',
  styleUrls: ['./promotion-type-list.component.css']
})
export class PromotionTypeListComponent implements OnInit {

	proTypes: PromotionType[];

  	constructor(
  		private promotionTypeService: PromotionTypeService
  		) 
  	{ }

  	ngOnInit() {
  		this.getAllPromotionType();
  	}

  	getAllPromotionType() {
  		this.promotionTypeService.getAllPromotionsType().subscribe(
  			result => this.proTypes = result
  			)
  	}

}
