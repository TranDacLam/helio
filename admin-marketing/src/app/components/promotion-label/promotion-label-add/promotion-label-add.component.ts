import { Component, OnInit } from '@angular/core';

import { PromotionLabel } from '../../../shared/class/promotion-label';

import { PromotionLabelService } from '../../../shared/services/promotion-label.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-promotion-label-add',
  templateUrl: './promotion-label-add.component.html',
  styleUrls: ['./promotion-label-add.component.css']
})
export class PromotionLabelAddComponent implements OnInit {

	promotions_label: PromotionLabel[] = [];

  	constructor(
  		private promotionLabelService: PromotionLabelService,
  		private router: Router
  		) { }

  	ngOnInit() {
  	}

  	CreatePromotionLabel(name: string){
  		this.promotionLabelService.addPromotionLabel( {name} as PromotionLabel)
  			.subscribe(resProLabel => {
  				this.promotions_label.push(resProLabel)
  			});
  			this.router.navigate(['/promotion-label-list'])
  	}

}
