import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Hot } from '../../../shared/class/hot';
import { HotService } from '../../../shared/services/hot.service';
import { DateValidators } from './../../../shared/validators/date-validators';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { env } from '../../../../environments/environment';
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

    @Input() hot: Hot; // Get hot from component parent

    formHot: FormGroup;

    errorMessage = ''; // Messages error

    msg_clear_image = '';

    api_domain: string = '';
    lang = 'vi';

    constructor(
        private hotService: HotService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute
    ) { 
        this.api_domain = env.api_domain_root;
    }

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
        this.formHot = this.fb.group({
            name: [this.hot.name, Validators.required],
            image: [this.hot.image, Validators.required],
            sub_url: [this.hot.sub_url, Validators.required],
            is_show: [this.hot.is_show],
            is_clear_image: [false]
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
        }else{
            let hot_form_data = this.convertFormGroupToFormData(this.formHot);
            let value_form = this.formHot.value;
            if(!this.hot.id){
                this.hotService.addHot(hot_form_data, this.lang).subscribe(
                    (data) => {
                        this.router.navigate(['/hot/list', { message_post: value_form.name}]);
                    },
                    (error) => {
                        if(error.code === 400){
                            this.errorMessage = error.message;
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
                            this.router.navigate(['/hot/list', { message_put: value_form.name}]);
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
        
    }

    /*
        Function deleteNotificationEvent(): confirm delete
        @author: Lam
    */
    deleteHotEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn",
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
                this.router.navigate(['/hot/list', { message_del: 'success'}]);
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
