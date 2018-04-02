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
import { ImageValidators } from './../../../shared/validators/image-validators';
import { ToastrService } from 'ngx-toastr';
import { User } from './../../../shared/class/user';
import { VariableGlobals } from './../../../shared/commons/variable_globals';
import { env } from '../../../../environments/environment';
import * as ckeditor_config from './../../../shared/commons/ckeditor_config';
import * as moment from 'moment';

declare var $ :any; // declare Jquery
declare var bootbox:any;

@Component({
    selector: 'app-promotion-form-detail',
    templateUrl: './promotion-form-detail.component.html',
    styleUrls: ['./promotion-form-detail.component.css'],
    providers: [
        PromotionService,
        PromotionLabelService
    ]
})

export class PromotionFormDetailComponent implements OnInit {

    promotion: Promotion;

    @Input() position; // Get type http from component parent

    // Return 1 object to parent
    @Output() update_promotion: EventEmitter<Promotion> = new EventEmitter<Promotion>();

    promotionTypes: PromotionType[];
    promotionLabels: PromotionLabel[];
    categorys: Category[];
    user_current: User;

    promotionForm: FormGroup;
    ckEditorConfig:any;
    selected = true;

    api_domain:string = "";

    errors: any = "";
    apply_date: Date = new Date();

    lang = 'vi';
    title_page = "";

    constructor(
        private promotionService: PromotionService,
        private categoryService: CategoryService,
        private promotionTypeService: PromotionTypeService,
        private promotionLabelService: PromotionLabelService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private toastr: ToastrService,
        private variable_globals: VariableGlobals,
    ) {
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });

        setTimeout(()=>{
            this.user_current = this.variable_globals.user_current;
        },100);

        this.getAllCategory();
        this.getPromotionTypes();
        this.getPromotionLabels();

        this.ckEditorConfig = ckeditor_config.config;

        if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title_page = "Chỉnh Sửa Khuyến Mãi";
            this.getPromotion();
        } else {
            // Add new Form
            this.title_page = "Thêm Khuyến Mãi";
            this.promotion = new Promotion()
            this.creatPromotionForm();
        }
    }

    /*
        function creatForm(): Create Reactive Form
        @author: diemnguyen
    */ 
    private creatPromotionForm(): void {
        this.promotionForm = this.fb.group({
            id: [this.promotion.id],
            name: [this.promotion.name, [Validators.required, Validators.maxLength(255)]],
            image: [this.promotion.image, [ImageValidators.validateFile]],
            image_thumbnail: [this.promotion.image_thumbnail, [ImageValidators.validateFile]],
            short_description: [this.promotion.short_description, [Validators.required, Validators.maxLength(350)]],
            content: [this.promotion.content, [Validators.required]],
            promotion_category: [this.promotion.promotion_category ? this.promotion.promotion_category : ''],
            promotion_label: [this.promotion.promotion_label ? this.promotion.promotion_label : ''],
            promotion_type: [this.promotion.promotion_type ? this.promotion.promotion_type.id : ''],
            apply_date: [this.promotion.apply_date ? moment(this.promotion.apply_date,"DD/MM/YYYY").toDate() : '',
                [DateValidators.validStartDate, DateValidators.formatStartDate]],
            end_date: [this.promotion.end_date ? moment(this.promotion.end_date,"DD/MM/YYYY").toDate() : '',
                [DateValidators.validEndDate, DateValidators.formatEndDate]],
            apply_time: [this.promotion.apply_time ? moment(this.promotion.apply_time,"HH:mm").format() : '', 
                [DateValidators.validStartTime, DateValidators.formatStartTime]],
            end_time: [this.promotion.end_time ? moment(this.promotion.end_time,"HH:mm").format() : '',
                [DateValidators.validEndTime, DateValidators.formatEndTime]],
            is_draft: [this.promotion.is_draft],
            is_clear_image: [false],
            is_clear_image_thumbnail: [false],
        }, {validator: [this.dateLessThan(), this.timeLessThan()]});
    }

    /*
        Function dateLessThan(): validate apply date and end date
        Author: Lam
    */
    dateLessThan() {
        return (group: FormGroup): {[key: string]: any} => {
            let start = $('#start_date').val() ? moment($('#start_date').val(), "DD/MM/YYYY").toDate() : '';
            let end = $('#end_date').val() ? moment($('#end_date').val(), "DD/MM/YYYY").toDate() : '';
            if(start <= end || start === '' || end === ''){

                return {};
            }
            return {
                dates: "Vui lòng nhập ngày kết thúc lớn hơn hoặc bằng ngày áp dụng"
            };
        }
    }

    /*
        Function timeLessThan(): validate start time and end time
        Author: Lam
    */
    timeLessThan(){
        return (group: FormGroup): {[key: string]: any} => {
            let start_date = $('#start_date').val() ? $('#start_date').val() : '';
            let end_date = $('#end_date').val() ? $('#end_date').val() : '';
            let start_time = $('#start_time').val() ? moment($('#start_time').val(), 'HH:mm').toDate() : '';
            let end_time = $('#end_time').val() ? moment($('#end_time').val(), 'HH:mm').toDate() : '';
            if(start_time !== '' || end_time !== ''){
                if(start_date === ''){
                    return {
                        datempty: "Vui lòng nhập ngày áp dụng"
                    };
                }else if(start_time === '' || end_time === ''){
                    return {
                        slectedtime: "Vui lòng nhập thời gian áp dụng/kết thúc"
                    };
                }else{
                    if(start_date === end_date && start_time >= end_time){
                        return {
                            times: "Vui lòng nhập thời gian kết thúc lớn hơn thời gian áp dụng"
                        };
                    }
                }
            }
            return {};
        }
    }    

    /*
        Call Service get promotion by Id
        @author: diemnguyen 
    */
    getPromotion() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.promotionService.getPromotionById(id, this.lang).subscribe((data) => {
            this.promotion = data;
            this.creatPromotionForm();
        }, (error) => {
            this.router.navigate(['/error', { message: error.message}]);
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
                this.router.navigate(['/error', { message: error.message}]);
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
                this.router.navigate(['/error', { message: error.message}]);
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
        this.promotionForm.controls['apply_date'].setValidators([DateValidators.validStartDate,
            DateValidators.formatEndDate]);
        this.promotionForm.controls['apply_date'].updateValueAndValidity();
        this.promotionForm.controls['end_date'].setValidators([DateValidators.validEndDate,
            DateValidators.formatEndDate]);
        this.promotionForm.controls['end_date'].updateValueAndValidity();
        this.promotionForm.controls['apply_time'].setValidators([DateValidators.validStartTime,
            DateValidators.formatStartTime]);
        this.promotionForm.controls['apply_time'].updateValueAndValidity();
        this.promotionForm.controls['end_time'].setValidators([DateValidators.validEndTime,
            DateValidators.formatEndTime]);
        this.promotionForm.controls['end_time'].updateValueAndValidity();

        if(this.promotionForm.invalid){
            ValidateSubmit.validateAllFormFields(this.promotionForm);
            this.scrollTop();
        }else{
            this.promotionForm.value.apply_time = $('#start_time').val();
            this.promotionForm.value.end_time = $('#end_time').val();
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
                        // popup edit pormotion at user promotion
                        if(this.position === 'popup'){
                            this.promotion = data;
                            this.update_promotion.emit(this.promotion);
                            $('#UpdatePromotion').modal('toggle');
                            this.toastr.success(`Chỉnh sửa "${this.promotionForm.value.name}" thành công`);
                        }else{
                            // Navigate to promotion page where success
                            this.toastr.success(`Chỉnh sửa "${this.promotionForm.value.name}" thành công`);
                            that.router.navigate(['/promotions']);
                        }
                    }, 
                    (error) => {
                        if(error.code === 400){
                            that.errors = error.message;
                            this.scrollTop();
                        }else{
                            that.router.navigate(['/error']);
                        }
                    }
                );
            } else {
                this.promotionService.savePromotion(promotionFormData, this.lang).subscribe(
                    (data) => {
                        // Navigate to promotion page where success
                        this.toastr.success(`Thêm mới "${this.promotionForm.value.name}" thành công`);
                        that.router.navigate(['/promotions']);
                    }, 
                    (error) => {
                        if(error.code === 400){
                            that.errors = error.message;
                            this.scrollTop();
                        }else{
                            that.router.navigate(['/error']);
                        }
                    }
                );
            }
        }
    }

    /*
        Function scrollTop(): creoll top when have validate
        @author: Lam
    */
    scrollTop(){
        $('html,body').animate({ scrollTop: $('.title').offset().top }, 'slow');
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
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn Khuyến Mãi tử này?",
                buttons: {
                    cancel: {
                        label: "HỦY"
                    },
                    confirm: {
                        label: "XÓA"
                    }
                },
                callback: function (result) {
                    if(result) {
                        // Call service delete promotion by id
                        that.promotionService.deletePromotionById(id, that.lang).subscribe(
                            (data) => {
                                that.toastr.success(`Xóa "${that.promotion.name}" thành công`);
                                that.router.navigate(['/promotions']);
                            }, 
                            (error) => {
                                that.router.navigate(['/error', { message: error.message}]);
                            });
                    }
                }
            });

        } else  {
            bootbox.alert("Vui lòng chọn Khuyến Mãi cần xóa");
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
