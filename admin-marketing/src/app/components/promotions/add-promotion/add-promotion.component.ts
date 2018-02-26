import { Component, OnInit } from '@angular/core';
import { Promotion } from '../../../shared/class/promotion';

@Component({
  	selector: 'app-add-promotion',
  	templateUrl: './add-promotion.component.html',
  	styleUrls: ['./add-promotion.component.css']
})
export class AddPromotionComponent implements OnInit {

	promotion: Promotion = new Promotion()

  	constructor() { }

  	ngOnInit() {
  	}

}
