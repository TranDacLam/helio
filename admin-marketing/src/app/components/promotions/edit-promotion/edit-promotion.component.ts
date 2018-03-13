import { Component, OnInit } from '@angular/core';
import { PromotionService } from '../../../shared/services/promotion.service';
import { Promotion } from '../../../shared/class/promotion';
import { ActivatedRoute } from '@angular/router';

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

    constructor(
        private promotionService: PromotionService, 
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.getPromotion();
    }

    /*
        Call Service get promotion by Id
        @author: diemnguyen 
    */
    getPromotion() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.promotionService.getPromotionById(id).subscribe((data) => {
            this.promotion = data;
        }, (error) => {
        
        });
    }
}
