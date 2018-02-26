import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import 'rxjs/add/observable/throw';

import { Promotion } from '../../../shared/class/promotion';
import { PromotionType } from '../../../shared/class/promotion-type';
import { PromotionLabel } from '../../../shared/class/promotion-label';
import { PromotionService } from '../../../shared/services/promotion.service';
/*import { CategoryService } from '../../../shared/services/category.service';*/
import { PromotionTypeService } from '../../../shared/services/promotion-type.service';
import { PromotionLabelService } from '../../../shared/services/promotion-label.service';

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
    
    promotionForm: FormGroup;

    ckEditorConfig:any;

    constructor(
        private promotionService: PromotionService,
        private promotionTypeService: PromotionTypeService,
        private promotionLabelService: PromotionLabelService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.getPromotionTypes();
        this.getPromotionLabels();

        this.ckEditorConfig = {
            uiColor: '#337ab7', 
            filebrowserUploadUrl: 'http://127.0.0.1:8000/ckeditor/upload/'

        };
        this.creatPromotionForm();
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
            
            promotion_label: [this.promotion.promotion_label],
            promotion_type: [this.promotion.promotion_type],
        });
    }
    onFileUploadRequest(event) {
        console.log("aaaaa");
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

    saveEvent(): void {
        const that = this;
        if(this.promotion.id) {
            this.promotionService.updatePromotion(this.promotionForm.value).subscribe(
                (data) => {
                    //TO DO : check is success
                    that.router.navigate(['/promotions', {'action': 'Sửa "', 'promotion_name': that.promotion.name}]);
                },
                (error) => {
                    that.router.navigate(['/error']);
                }
            );
        } else {
            this.promotionService.savePromotion(this.promotionForm.value).subscribe(
                (data) => {
                    //TO DO : check is success
                    that.router.navigate(['/promotions', {'action': 'Tạo mới "', 'promotion_name': that.promotion.name}]);
                }, 
                (error) => {
                    that.router.navigate(['/error']);
                }
            );
        }
    }

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
