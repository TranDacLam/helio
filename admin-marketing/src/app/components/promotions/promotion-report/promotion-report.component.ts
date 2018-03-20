import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionService } from './../../../shared/services/promotion.service';
import { Promotion } from './../../../shared/class/promotion';
import { User } from './../../../shared/class/user';
import { Subject } from 'rxjs/Subject';
import * as datatable_config from '../../../shared/commons/datatable_config';


@Component({
    selector: 'app-promotion-report',
    templateUrl: './promotion-report.component.html',
    styleUrls: ['./promotion-report.component.css'],
    providers: [PromotionService]
})
export class PromotionReportComponent implements OnInit {

    promotion: Promotion;
    promotion_user: User[];

    dtOptions: any = {};

    lang = 'vi';

  	constructor(
        private promotionService: PromotionService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

  	ngOnInit() {
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
        this.getPromotion();
        this.dtOptions = datatable_config.data_config('Tổng Hợp Triển Khai Khuyến Mãi');
  	}

    /*
        Call Service get promotion by Id
        @author: diemnguyen 
    */
    getPromotion() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.promotionService.getPromotionById(id, this.lang).subscribe(
            (data) => {
                this.promotion = data;
            }, 
            (error) => {
                 this.router.navigate(['/error']);
            }
        );
    }

}
