import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PromotionLabel } from '../../../shared/class/promotion-label';
import { PromotionLabelService } from '../../../shared/services/promotion-label.service';
import 'rxjs/add/observable/throw';


@Component({
    selector: 'app-add-promotion-label',
    templateUrl: './add-promotion-label.component.html',
    styleUrls: ['./add-promotion-label.component.css'],
    providers: [PromotionLabelService]
})
export class AddPromotionLabelComponent implements OnInit {

    /*
        author: Lam
    */

    promotion_label: PromotionLabel = new PromotionLabel();

    formPromotionLabel: FormGroup;

    errorMessage = ''; // Messages error

    constructor(
        private promotionLabelService: PromotionLabelService,
        private fb: FormBuilder,
        private router: Router,
    ) { }

    ngOnInit() {
        this.creatForm();
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formPromotionLabel = this.fb.group({
            name: [this.promotion_label.name, Validators.required]
        });
    }

    /*
        Function onSubmit():
         + Call service function addPromotionLabel use http post
         + Later, success then redirect faq/list with messsage, fail show error
        author: Lam
    */ 
    onSubmit(): void{
        this.promotionLabelService.addPromotionLabel(this.formPromotionLabel.value).subscribe(
            (data) => {
                this.router.navigate(['/promotion-label/list', { message_post: this.formPromotionLabel.value.name}]);
            },
            (error) => {
                { this.errorMessage = error.message; } 
            }
        );
    }

}
