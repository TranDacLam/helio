import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import 'rxjs/add/observable/throw';

import { Promotion } from '../../../shared/class/promotion';
import { Category } from '../../../shared/class/category';
import { PromotionType } from '../../../shared/class/promotion-type';
import { PromotionLabel } from '../../../shared/class/promotion-label';
import { PromotionService } from '../../../shared/services/promotion.service';
import { CategoryService } from '../../../shared/services/category.service';
import { PromotionTypeService } from '../../../shared/services/promotion-type.service';
import { PromotionLabelService } from '../../../shared/services/promotion-label.service';
import { DatePipe } from '@angular/common';
import { DateValidators } from './../../../shared/validators/date-validators';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';

import { env } from '../../../../environments/environment';
import * as moment from 'moment';

declare var bootbox:any;

@Component({
    selector: 'app-promotion-form',
    templateUrl: './promotion-form.component.html',
    styleUrls: ['./promotion-form.component.css'],
    providers: [
        PromotionService,
        PromotionLabelService
    ]
})

export class PromotionFormComponent implements OnInit {

    @Input() 
    promotion: Promotion;

    promotionTypes: PromotionType[];
    promotionLabels: PromotionLabel[];
    categorys: Category[];

    promotionForm: FormGroup;
    ckEditorConfig:any;
    selected = true;

    api_domain:string = "";

    errors: any = "";
    apply_date: Date = new Date();

    lang = 'vi';

    constructor(
        private promotionService: PromotionService,
        private categoryService: CategoryService,
        private promotionTypeService: PromotionTypeService,
        private promotionLabelService: PromotionLabelService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private datePipe: DatePipe
    ) {
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });

        this.getAllCategory();
        this.getPromotionTypes();
        this.getPromotionLabels();

        this.ckEditorConfig = {
            // filebrowserUploadUrl: 'http://127.0.0.1:8000/vi/api/upload_file/'

        };
        this.creatPromotionForm();
    }

    /*
        function creatForm(): Create Reactive Form
        @author: diemnguyen
    */ 
    private creatPromotionForm(): void {
        this.promotionForm = this.fb.group({
            id: [this.promotion.id],
            name: [this.promotion.name, [Validators.required, Validators.maxLength(255)]],
            image: [this.promotion.image],
            image_thumbnail: [this.promotion.image_thumbnail],
            short_description: [this.promotion.short_description, [Validators.required, Validators.maxLength(350)]],
            content: [this.promotion.content, [Validators.required]],
            promotion_category: [this.promotion.promotion_category ? this.promotion.promotion_category : ''],
            promotion_label: [this.promotion.promotion_label ? this.promotion.promotion_label : ''],
            promotion_type: [this.promotion.promotion_type ? this.promotion.promotion_type.id : ''],
            apply_date: [this.promotion.apply_date ? moment(this.promotion.apply_date,"DD/MM/YYYY").toDate() : '',
                [DateValidators.formatStartDate]],
            end_date: [this.promotion.end_date ? moment(this.promotion.end_date,"DD/MM/YYYY").toDate() : '',
                [DateValidators.checkDate, DateValidators.formatEndDate]],
            is_draft: [this.promotion.is_draft],
        });
    }

    /*
        function getPromotionType(): get all promotion type
        @author: diemnguyen
    */ 
    getAllCategory(): void{
        this.categoryService.getAllCategory().subscribe(
            (data) => {
                this.categorys = data;
            },
            (error) => {
                this.router.navigate(['/error']);
            }
        );
    }

    /*
        function getPromotionType(): get all promotion type
        @author: diemnguyen
    */ 
    getPromotionTypes(): void{
        this.promotionTypeService.getAllPromotionsType().subscribe(
            (data) => {
                this.promotionTypes = data;
            },
            (error) => {
                this.router.navigate(['/error']);
            }
        );
    }

    /*
        function getPromotionLabel(): get all promotion label
        @author: diemnguyen
    */ 
    getPromotionLabels(): void{
        this.promotionLabelService.getPromotionLabels(this.lang).subscribe(
            (data) => {
                this.promotionLabels = data;
            },
            (error) => {
                this.router.navigate(['/error']);
            }
        );
    }


    /*
        Change file input event. ( image field and thumbnail image field)
        @author: diemnguyen
    */
    onFileChange(event) {
        let reader = new FileReader();
        let input_id = $(event.target).attr('id');
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.promotionForm.get(input_id).setValue({ filename: file.name, filetype: file.type, value: file });
        }
    }

    /*
        Click save button
        Call save(promotion id is null) or update(promotion id is not null) service
        @author: diemnguyen
    */
    saveEvent(): void {
        this.promotionForm.controls['apply_date'].setValidators([DateValidators.formatEndDate]);
        this.promotionForm.controls['apply_date'].updateValueAndValidity();
        this.promotionForm.controls['end_date'].setValidators([DateValidators.checkDate, DateValidators.formatEndDate]);
        this.promotionForm.controls['end_date'].updateValueAndValidity();
        if(this.promotionForm.invalid){
            ValidateSubmit.validateAllFormFields(this.promotionForm);
        }else{
            this.errors = '';
            const that = this;
            // Convert FormGroup to FormData
            let promotionFormData = this.convertFormGroupToFormData(this.promotionForm);
            /*
                Case 1: Promotion id is not null then call update service
                Case 1: Promotion id is null then call save service
            */
            if(this.promotion.id) {
                this.promotionService.updatePromotion(promotionFormData, this.promotion.id, this.lang).subscribe(
                    (data) => {
                        // Navigate to promotion page where success
                        that.router.navigate(['/promotions', {'action': 'Sửa "', 'promotion_name': this.promotionForm.value['name']}]);
                    }, 
                    (error) => {
                        if(error.code === 400){
                            that.errors = error.message;
                        }else{
                            that.router.navigate(['/error']);
                        }
                    }
                );
            } else {
                this.promotionService.savePromotion(promotionFormData, this.lang).subscribe(
                    (data) => {
                        // Navigate to promotion page where success
                        that.router.navigate(['/promotions', {'action': 'Tạo mới "', 'promotion_name': this.promotionForm.value['name']}]);
                    }, 
                    (error) => {
                        if(error.code === 400){
                            that.errors = error.message;
                        }else{
                            that.router.navigate(['/error']);
                        }
                    }
                );
            }
        }
    }

    /*
        Click promotion button
        step1: open popup comfirm
        step2:  + click ok button call service delete
                + click cance button close popup
        @author: diemnguyen
    */
    deletePromotionEvent(event) {
        const id = this.promotion.id;
        const that = this;
        if (id) {
            bootbox.confirm({
                title: "Bạn có chắc chắn",
                message: "Bạn muốn xóa phần tử này",
                buttons: {
                    cancel: {
                        label: "Hủy"
                    },
                    confirm: {
                        label: "Xóa"
                    }
                },
                callback: function (result) {
                    if(result) {
                        // Call service delete promotion by id
                        that.promotionService.deletePromotionById(id, that.lang).subscribe(
                            (data) => {
                                that.router.navigate(['/promotions', {'action': 'Xóa "', 'promotion_name': that.promotion.name}]);
                            }, 
                            (error) => {
                                that.router.navigate(['/error']);
                            });
                    }
                }
            });

        } else  {
            bootbox.alert("Vui lòng chọn phần tử cần xóa");
        }
    }

    /*
        Convert form group to form data to submit form
        @author: diemnguyen
    */
    private convertFormGroupToFormData(promotionForm: FormGroup) {
        // Convert FormGroup to FormData
        let promotionValues = promotionForm.value;
        let promotionFormData:FormData = new FormData(); 
        if (promotionValues){
            /* 
                Loop to set value to formData
                Case1: if value is null then set ""
                Case2: If key is image field then set value have both file and name
                Else: Set value default
            */
            Object.keys(promotionValues).forEach(k => { 
                if(promotionValues[k] == null) {
                    promotionFormData.append(k, '');
                } else if (k === 'image' || k === 'image_thumbnail') {
                    promotionFormData.append(k, promotionValues[k].value, promotionValues[k].name);
                } else if (k === 'apply_date' || k === 'end_date') {
                    promotionFormData.append(k, this.transformDate(promotionValues[k]));
                } else {
                    promotionFormData.append(k, promotionValues[k]);
                }
            });
        }
        return promotionFormData;
    }

    transformDate(date) {
        return date ? this.datePipe.transform(date, 'dd/MM/yyyy') : '';
    }
}
