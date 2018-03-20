import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { PromotionService } from '../../../shared/services/promotion.service';
import { User } from '../../../shared/class/user';
import { Promotion } from '../../../shared/class/promotion'
import { env } from '../../../../environments/environment';
import { VariableGlobals } from './../../../shared/commons/variable_globals';
import { ToastrService } from 'ngx-toastr';

declare var bootbox:any;
declare var $: any;


@Component({
  	selector: 'app-user-promotion',
  	templateUrl: './user-promotion.component.html',
  	styleUrls: ['./user-promotion.component.css'],
    providers: [
        PromotionService
    ]
})
export class UserPromotionComponent implements OnInit {

    promotion: Promotion;
	user_list_left: User[];
    user_list_right: User[];

    user_current: User;

    api_domain:string = "";

    notification_id: number;

    lang = 'vi';

    constructor(
        private router: Router,
        private route: ActivatedRoute, 
        private promotionService: PromotionService,
        private variable_globals: VariableGlobals,
        private toastr: ToastrService
    ) { 
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });

    	this.getUsersPromotion();
        setTimeout(()=>{
            this.user_current = this.variable_globals.user_current;
        },100);
    }

    getUsersPromotion(){
        const promotion_id = +this.route.snapshot.paramMap.get('id');

        this.promotionService.getUsersPromotion(promotion_id, this.lang).subscribe(
            (data)=> {
                this.notification_id = data.notification_id;
                this.promotion = data.promotion_detail;
                this.user_list_left = data.user_all;
                this.user_list_right = data.user_promotion;
            }, 
            (error) => {
                this.router.navigate(['/error'], { message: error.message});
            });
    }

    /*
        Function updateUserPromotion(): check valid
        Author: Lam
    */
    updateUserPromotion(list_user_id) {
        if(this.promotion.is_save === false){
            if(list_user_id.length > 0){
                this.updateUser(list_user_id)
            }else{
                this.toastr.warning(`Vui lòng chọn user`);
            }
        }else{
            if(this.user_current.role === 1){
                this.updateUser(list_user_id);
            }else{
                this.toastr.warning(`Chức năng này chỉ dành cho System Admin`);
            }
        }
	}

    updateUser(list_user_id){
        const promotion_id = +this.route.snapshot.paramMap.get('id');
        this.promotionService.updateUserPromotion(promotion_id, list_user_id, this.lang).subscribe(
            (data)=> {
                if (data.status == 204) {
                    this.toastr.success(`Lưu thành công`);
                } 
            }, 
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

    generator_QR_code(event , id: number) {
        let element = $(event.target);
        element.button('loading');
        this.promotionService.generator_QR_code(id).subscribe(
            (data) => {
                if(data.status == 200) {
                    let body = data.json(); 
                    this.promotion.QR_code = body.qr_code_url;
                }
                element.button('reset');
            }, 
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            });
    }

}
