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
    count_user_total: number;
    count_user_deviced: number;
    count_user_not_deviced: number;
    list_user: any;

  	constructor(
        private promotionService: PromotionService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

  	ngOnInit() {
        // get params url
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
        this.getPromotionReport();
        this.dtOptions = datatable_config.data_config('Tổng Hợp Triển Khai Khuyến Mãi');
        // custom datatable option
        let dt_options_custom = {
            columnDefs: [
                {
                    targets: 0,
                    visible: false
                }
            ]
        };
        // create new object from 2 object use operator spread es6
        this.dtOptions = {...this.dtOptions, ...dt_options_custom };
  	}

    /*
        Call Service get promotion report by Id
        @author: Lam 
    */
    getPromotionReport(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.promotionService.getPromotionReport(id, this.lang).subscribe(
            (data) => {
                this.promotion = data.promotion;
                this.count_user_total = data.count_user_total;
                this.count_user_deviced = data.count_user_device;
                this.count_user_not_deviced = data.count_user;
                this.list_user = data.gift_user;
            }, 
            (error) => {
                this.router.navigate(['/error', {message: error.message}]);
            }
        );
    }

}
