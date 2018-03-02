import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import 'rxjs/add/observable/throw';
import { DateTimeAdapter } from 'ng-pick-datetime';

import { Promotion } from '../../../shared/class/promotion';
import { Category } from '../../../shared/class/category';
import { PromotionType } from '../../../shared/class/promotion-type';
import { PromotionLabel } from '../../../shared/class/promotion-label';
import { PromotionService } from '../../../shared/services/promotion.service';
import { CategoryService } from '../../../shared/services/category.service';
import { PromotionTypeService } from '../../../shared/services/promotion-type.service';
import { PromotionLabelService } from '../../../shared/services/promotion-label.service';


import { env } from '../../../../environments/environment';

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
    constructor(
        private promotionService: PromotionService,
        private categoryService: CategoryService,
        private promotionTypeService: PromotionTypeService,
        private promotionLabelService: PromotionLabelService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private dateTimeAdapter: DateTimeAdapter<any>
    ) { 
        dateTimeAdapter.setLocale('en-GB'); 
    }

    ngOnInit() {
        this.api_domain = env.api_domain_root;
        
        this.getAllCategory();
        this.getPromotionTypes();
        this.getPromotionLabels();

        this.ckEditorConfig = {
            filebrowserUploadUrl: 'http://127.0.0.1:8000/ckeditor/upload/'

        };
        this.creatPromotionForm();
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
        this.promotionLabelService.getPromotionLabels().subscribe(
            (data) => {
                this.promotionLabels = data;
            },
            (error) => {
                this.router.navigate(['/error']);
            }
        );
    }

    /*
        function creatForm(): Create Reactive Form
        @author: diemnguyen
    */ 
    private creatPromotionForm(): void {
        this.promotionForm = this.fb.group({
        	id: [this.promotion.id],
            name: [this.promotion.name, [Validators.required]],
            image: [this.promotion.image],
            image_thumbnail: [this.promotion.image_thumbnail],
            short_description: [this.promotion.short_description, [Validators.required]],
            content: [this.promotion.content, [Validators.required]],
            promotion_category: [this.promotion.promotion_category ? this.promotion.promotion_category : ''],
            promotion_label: [this.promotion.promotion_label ? this.promotion.promotion_label : ''],
            promotion_type: [this.promotion.promotion_type ? this.promotion.promotion_type.id : ''],
            apply_date: [this.promotion.apply_date],
            end_date: [this.promotion.end_date],
        });
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
        const that = this;
        // Convert FormGroup to FormData
        let promotionValues = this.promotionForm.value;
        let promotionFormData = new FormData(); 

        // Loop to set value to formData
        Object.keys(promotionValues).forEach(k => { 
            if(!promotionValues[k]) {
                promotionFormData.append(k, '');
            } else if (k === 'image' || k === 'image_thumbnail') {
                promotionFormData.append(k, promotionValues[k].value, promotionValues[k].name);
            } else {
                promotionFormData.append(k, promotionValues[k]);
            }
        });
        /*
            Case 1: Promotion id is not null then call update service
            Case 1: Promotion id is null then call save service
        */
        if(this.promotion.id) {
            this.promotionService.updatePromotion(promotionFormData, this.promotion.id).subscribe(
                (data) => {
                    // Navigate to promotion page where success
                    that.router.navigate(['/promotions', {'action': 'Sửa "', 'promotion_name': promotionValues['name']}]);
                }, 
                (error) => {
                    that.router.navigate(['/error']);
                }
            );
        } else {
            this.promotionService.savePromotion(promotionFormData).subscribe(
                (data) => {
                    // Navigate to promotion page where success
                    that.router.navigate(['/promotions', {'action': 'Tạo mới "', 'promotion_name': promotionValues['name']}]);
                }, 
                (error) => {
                    that.router.navigate(['/error']);
                }
            );
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
                        that.promotionService.deletePromotionById(id).subscribe(
                            (data) => {
                                if (data.status == 204) {
                                    that.router.navigate(['/promotions', {'action': 'Xóa "', 'promotion_name': that.promotion.name}]);
                                } else {
                                    console.log("Xoa khong thanh cong");
                                }
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
}
