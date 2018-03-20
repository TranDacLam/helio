import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PromotionLabel } from '../../../shared/class/promotion-label';
import { PromotionLabelService } from '../../../shared/services/promotion-label.service';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ToastrService } from 'ngx-toastr';
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

    errorMessage: any; // Messages error

    lang = 'vi';

    constructor(
        private promotionLabelService: PromotionLabelService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.creatForm();
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formPromotionLabel = this.fb.group({
            name: [this.promotion_label.name, [Validators.required, Validators.maxLength(255)]]
        });
    }

    /*
        Function onSubmit():
         + Call service function addPromotionLabel use http post
         + Later, success then redirect faq/list with messsage, fail show error
        author: Lam
    */ 
    onSubmit(): void{
        if(this.formPromotionLabel.invalid){
            ValidateSubmit.validateAllFormFields(this.formPromotionLabel);
        }else{
            this.promotionLabelService.addPromotionLabel(this.formPromotionLabel.value, this.lang).subscribe(
                (data) => {
                    this.toastr.success(`Thêm mới "${this.formPromotionLabel.value.name}" thành công`);
                    this.router.navigate(['/promotion-label/list']);
                },
                (error) => {
                    if(error.code === 400){
                        this.errorMessage = error.message;
                    }else{
                        this.router.navigate(['/error', { message: error.message}]);
                    }
                }
            );
        }
    }

}
