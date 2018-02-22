import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Promotion } from '../../../shared/class/promotion';
import { PromotionService } from '../../../shared/services/promotion.service';
import 'rxjs/add/observable/throw';

@Component({
  selector: 'app-promotion-form',
  templateUrl: './promotion-form.component.html',
  styleUrls: ['./promotion-form.component.css']
})
export class PromotionFormComponent implements OnInit {

    @Input() 
    promotion: Promotion;
    
    promotionForm: FormGroup;


    constructor(
        private promotionService: PromotionService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.creatPromotionForm();
    }

    /*
        function creatForm(): Create Reactive Form
        @author: diemnguyen
    */ 
    private creatPromotionForm(): void {
        this.promotionForm = this.fb.group({
        	id: [this.promotion.id],
            name: [this.promotion.name],
            image: [this.promotion.image],
            image_thumbnail: [this.promotion.image_thumbnail],
            short_description: [this.promotion.short_description],
            content: [this.promotion.content],
        });
    }

    onSubmit(): void {

    	console.log(this.promotionForm.value);

        // this.notificationService.updatePromotion(this.promotionForm.value).subscribe(
        //     (result) => {
        //         console.log(result);
        //     },
        //     (error) => {
        //         { this.errorMessage = error.message; } 
        //     }
        // );
        
    }

    onFileChange(event) {
	    let reader = new FileReader();
	    if(event.target.files && event.target.files.length > 0) {
			let file = event.target.files[0];
			reader.readAsDataURL(file);
			reader.onload = () => {
				this.promotionForm.get('image').setValue({
				  	filename: file.name,
				  	filetype: file.type,
				  	value: reader.result.split(',')[1]
				})
			};
	    }

	    console.log(this.promotionForm.value);
	}
}
