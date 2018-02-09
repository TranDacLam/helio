import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';


import { PromotionService } from '../../../shared/services/promotion.service';
import { Promotion } from '../../../shared/class/promotion';
import { datatable_config } from '../../../shared/commons/datatable_config';


@Component({
    selector: 'app-promotions',
    templateUrl: './promotions.component.html',
    styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {
	dtOptions: any = {};

	promotion_list: Promotion[] = [];

	dtTrigger: Subject<any> = new Subject();

    constructor(private promotionService: PromotionService) { }

    ngOnInit() {
    	this.getAllPromotion();

    	this.dtOptions = datatable_config.dtOptions;
    }

    getAllPromotion(){
        this.promotionService.getAllPromotion().subscribe(promotions => {
            this.promotion_list = promotions;
            this.dtTrigger.next();
        });
    }

}


    
