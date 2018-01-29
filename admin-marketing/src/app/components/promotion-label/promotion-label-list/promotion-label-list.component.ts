import { Component, OnInit } from '@angular/core';

import { PromotionLabel } from '../../../shared/class/promotion-label';

import { PromotionLabelService } from '../../../shared/services/promotion-label.service';

@Component({
  selector: 'app-promotion-label-list',
  templateUrl: './promotion-label-list.component.html',
  styleUrls: ['./promotion-label-list.component.css']
})
export class PromotionLabelListComponent implements OnInit {

	promotionsLabel: PromotionLabel[];
  	constructor(private promotionlabelService: PromotionLabelService) { }

 	ngOnInit() {
 	 	this.getAllPromotionLabel();
  	}

  	// Get All Promotion Label
	getAllPromotionLabel() {
    	this.promotionlabelService.getAllPromotionsLabel().subscribe(
      		result => this.promotionsLabel = result);
	}
}
