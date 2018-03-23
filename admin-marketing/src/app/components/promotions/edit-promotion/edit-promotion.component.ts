import { Component, OnInit } from '@angular/core';
import { PromotionService } from '../../../shared/services/promotion.service';
import { Promotion } from '../../../shared/class/promotion';
import { ActivatedRoute, Router } from '@angular/router';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
    selector: 'app-edit-promotion',
    templateUrl: './edit-promotion.component.html',
    styleUrls: ['./edit-promotion.component.css'],
    providers: [
        PromotionService
    ]
})

/*
    EditPromotionComponent
    @author: diemnguyen 
*/ 
export class EditPromotionComponent implements OnInit {

    promotion: Promotion;
    type_http = "put"; // type http to form promotion component 

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
    }

    /*
        Call Service get promotion by Id
        @author: diemnguyen 
    */
    getPromotion() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.promotionService.getPromotionById(id, this.lang).subscribe((data) => {
            this.promotion = data;
        }, (error) => {
            this.router.navigate(['/error', { message: error.message}]);
        });
    }
}
