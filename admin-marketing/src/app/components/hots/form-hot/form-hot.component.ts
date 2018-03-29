import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Hot } from '../../../shared/class/hot';
import { HotService } from '../../../shared/services/hot.service';
import { DateValidators } from './../../../shared/validators/date-validators';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ImageValidators } from './../../../shared/validators/image-validators';
import { env } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'form-hot',
    templateUrl: './form-hot.component.html',
    styleUrls: ['./form-hot.component.css'],
    providers: [HotService]
})
export class FormHotComponent implements OnInit {

    /*
        author: Lam
    */

    // set inputImage property as a local variable, #inputImage on the tag input file
    @ViewChild('inputImage')
    inputImage: any;

    hot: Hot;

    formHot: FormGroup;

    errorMessage = ''; // Messages error

    msg_clear_image = '';

    api_domain: string = '';
    lang = 'vi';
    title_page = '';

    constructor(
        private hotService: HotService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) { 
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
        // get params url
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });

         if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title_page = "Chỉnh Sửa Hot";
            this.getHot();
        } else {
            // Add new Form
            this.title_page = "Thêm Hot";
            this.hot = new Hot();
            this.creatForm();
        }
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formHot = this.fb.group({
            name: [this.hot.name, [Validators.required, Validators.maxLength(255)]],
            image: [this.hot.image, [ImageValidators.validateFile]],
            sub_url: [this.hot.sub_url, [Validators.required, Validators.maxLength(1000)]],
            is_show: [this.hot.is_show],
            is_clear_image: [false]
        });
    }

     /*
        Function getHot():
         + Get id from url path
         + Callback service function getHot() by id
        Author: Lam
    */
    getHot(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.hotService.getHot(id, this.lang).subscribe(data => {
            this.hot = data;
            this.creatForm();
        });
    }

    /*
        Function onFileChange(): Input file image to get base 64
        author: Lam
    */ 
    onFileChange(event): void{
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formHot.get('image').setValue({
                filename: file.name,
                filetype: file.type,
                value: file,
            });
        }
    }

    /*
        Function onSubmit():
         + Step 1: Check hot id
         + Step 2:  
            * TH1:  + Id empty then call service function addHot() to add hot, 
                    + Later, redirect list hot with message
            * TH2:  + Id exist then call service function updateHot() to update hot
                    + Later, redirect list hot with message
        author: Lam
    */
    onSubmit(): void{
        if(this.formHot.invalid){
            ValidateSubmit.validateAllFormFields(this.formHot);
            $('html,body').animate({ scrollTop: $('.ng-invalid').offset().top }, 'slow');
        }else{
            let hot_form_data = this.convertFormGroupToFormData(this.formHot);
            let value_form = this.formHot.value;
            if(!this.hot.id){
                this.hotService.addHot(hot_form_data, this.lang).subscribe(
                    (data) => {
                        this.toastr.success(`Thêm mới "${value_form.name}" thành công`);
                        this.router.navigate(['/hot/list']);
                    },
                    (error) => {
                        if(error.code === 400){
                            this.errorMessage = error.message;
                            $('html,body').animate({ scrollTop: $('.title').offset().top }, 'slow');
                        }else{
                            this.router.navigate(['/error', { message: error.message}]);
                        }
                    }
                );
            }else{
                if(value_form.is_clear_image === true && typeof(value_form.image) != 'string'){
                    this.formHot.get('is_clear_image').setValue(false);
                    this.msg_clear_image = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
                }else{
                    this.hotService.updateHot(hot_form_data, this.hot.id, this.lang).subscribe(
                        (data) => {
                            this.toastr.success(`Chỉnh sửa "${value_form.name}" thành công`);
                            this.router.navigate(['/hot/list']);
                        },
                        (error) => {
                            if(error.code === 400){
                                this.errorMessage = error.message;
                                $('html,body').animate({ scrollTop: $('.title').offset().top }, 'slow');
                            }else{
                                this.router.navigate(['/error', { message: error.message}]);
                            }
                        }
                    );
                }
            }
        }
        
    }

    /*
        Function deleteNotificationEvent(): confirm delete
        @author: Lam
    */
    deleteHotEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Hot này?",
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
                    that.onDelete();
                }
            }
        });
    }

    /*
        Function onDelete():
         + Get id from url path
         + Callback service function onDelNoti() by id to delete notification
        Author: Lam
    */
    onDelete(): void {
        const id = this.hot.id;
        this.hotService.onDelHot(id, this.lang).subscribe(
            (data) => {
                this.toastr.success(`Xóa "${this.formHot.value.name}" thành công`);
                this.router.navigate(['/hot/list']);
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

    /*
        Convert form group to form data to submit form
        @author: lam
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
                } else if (k === 'image') {
                    promotionFormData.append(k, promotionValues[k].value, promotionValues[k].name);
                } else {
                    promotionFormData.append(k, promotionValues[k]);
                }
            });
        }
        return promotionFormData;
    }

}
