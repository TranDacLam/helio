import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Notification } from '../../../shared/class/notification';
import { CategoryNotification } from '../../../shared/class/category-notification';
import { NotificationService } from '../../../shared/services/notification.service';
import { CategoryNotificationService } from '../../../shared/services/category-notification.service';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ToastrService } from 'ngx-toastr';
import { VariableGlobals } from './../../../shared/commons/variable_globals';
import { User } from '../../../shared/class/user';
import 'rxjs/add/observable/throw';
import { env } from '../../../../environments/environment';

declare var $ :any; // declare Jquery
declare var bootbox:any;

@Component({
    selector: 'form-notification',
    templateUrl: './form-notification.component.html',
    styleUrls: ['./form-notification.component.css'],
    providers: [
        NotificationService,
        CategoryNotificationService
    ]
})
export class FormNotificationComponent implements OnInit {

    /*
        author: Lam
    */

    // set inputImage property as a local variable, #inputImage on the tag input file
    @ViewChild('inputImage')
    inputImage: any;

    @Input() noti: Notification; // Get notification from component parent
    @Input() type_http; // Get type http from component parent
    @Input() promotion_id; // Get type http from component parent
    @Input() lang_promotion; // Get lang from component parent
    
    // Return 1 object to parent
    @Output() update_noti: EventEmitter<Notification> = new EventEmitter<Notification>();

    formNotification: FormGroup;

    categories: CategoryNotification[];
    user_current: User;

    check_QR: boolean = true; // Check enable/disable input QR
    check_Location: boolean = true; // Check enable/disable input Location

    errorMessage: any; // Messages error
    msg_clear_image = ''; // message clear image

    api_domain: string = '';
    lang = 'vi';

    constructor(
        private notificationService: NotificationService,
        private categoryNotificationService: CategoryNotificationService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private variable_globals: VariableGlobals,
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
        // get language when create notification for promotion 
        this.lang = this.lang_promotion ? this.lang_promotion : this.lang;

        this.getCategory();
        this.creatForm();
        // get current user
        setTimeout(()=>{
            this.user_current = this.variable_globals.user_current;
        },100);
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formNotification = this.fb.group({
            subject: [this.noti.subject, [Validators.required, Validators.maxLength(255)]],
            message: [this.noti.message, [Validators.required]],
            image: [this.noti.image],
            sub_url: [this.noti.sub_url, [Validators.maxLength(255)]],
            category: [this.noti.category ? this.noti.category : '', Validators.required],
            is_QR_code: [this.noti.is_QR_code ? this.noti.is_QR_code : false],
            location: [this.noti.location ? this.noti.location : '', [Validators.maxLength(500)]],
            is_clear_image: [false],
            promotion: [this.promotion_id ? this.promotion_id : null]
        });
    }

    /*
        function getCategory(): get all category nitofication
        author: Lam
    */ 
    getCategory(): void{
        this.categoryNotificationService.getCategoryNotifications(this.lang).subscribe(
            (data) => {
                this.categories = data.message;
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

    /*
        Function onFileChange(): Input file image to get base 64
        author: Lam
    */ 
    onFileChange(event): void{
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formNotification.get('image').setValue({
                filename: file.name,
                filetype: file.type,
                value: file,
            });
        }
    }

    /*
        Function onSubmit():
         + Step 1: Check type_http add notification (post), edit notification (put), edit use modal (put_popup)
         + Step 2:  
            * TH1:  + Type_http = post, callback service function addNoti() to add Notification, 
                    + Later, redirect list notification with message
            * TH2:  + Type_http = put or put_popup, callback service function updateNoti() to update Notification
                    + Type_http = put then check clear imgae, success then redirect list notification with message, fail show error
                    + Type_http = put_popup then update Notification show and hidden modal  
        author: Lam
    */ 
    onSubmit(): void{
        if(this.formNotification.invalid){
            ValidateSubmit.validateAllFormFields(this.formNotification);
        }else{
            this.formNotification.value.category = parseInt(this.formNotification.value.category);
            // Convert FormGroup to FormData
            let noti_form_data = this.convertFormGroupToFormData(this.formNotification);
            let value_form = this.formNotification.value;
            if(this.type_http == 'post'){
                this.notificationService.addNoti(noti_form_data, this.lang).subscribe(
                    (data) => {
                        this.toastr.success(`Thêm mới "${value_form.subject}" thành công`);
                        if(this.promotion_id){
                            this.router.navigate(['/notification/detail/', data.id, {lang: this.lang}]);
                        }else{
                            this.router.navigate(['/notification/list']);
                        }
                    },
                    (error) => {
                        if(error.code === 400){
                            this.errorMessage = error.message;
                        }else{
                            this.router.navigate(['/error']);
                        }
                    }
                );
            }else if(this.type_http == 'put' || this.type_http == 'put_popup'){
                if(value_form.is_clear_image === true && typeof(value_form.image) != 'string'){
                    this.formNotification.get('is_clear_image').setValue(false);
                    this.msg_clear_image = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
                }else{
                    this.notificationService.updateNoti(noti_form_data, this.noti.id, this.lang).subscribe(
                        (data) => {
                            this.noti = data;
                            if(this.type_http == "put"){
                                this.toastr.success(`Chỉnh sửa "${value_form.subject}" thành công`);
                                if(this.promotion_id){
                                    this.router.navigate(['/notification/detail/', data.id, {lang: this.lang}]);
                                }else{
                                    this.router.navigate(['/notification/list']);
                                }
                            }else if(this.type_http == 'put_popup'){
                                this.getNotification();
                                $('#UpdateNoti').modal('toggle');
                                this.toastr.success(`Chỉnh sửa "${value_form.subject}" thành công`);
                            }
                        },
                        (error) => {
                            if(error.code === 400){
                            this.errorMessage = error.message;
                        }else{
                            this.router.navigate(['/error']);
                        }
                        }
                    );
                }
            }
        }
    }

    /*
        Function getNotification():
         + Get id from url path
         + Callback service function getNotification() by id
        Author: Lam
    */
    getNotification(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.notificationService.getNotification(id, this.lang).subscribe(data => {
            this.noti = data;
            this.update_noti.emit(this.noti);
        });
    }

    /*
        Function deleteNotificationEvent(): confirm delete
        @author: Lam
    */
    deleteNotificationEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn ?",
            message: "Bạn muốn xóa Thông Báo này",
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
        const id = this.noti.id;
        this.notificationService.onDelNoti(id, this.lang).subscribe(
            (data) => {
                this.toastr.success(`Xóa "${this.formNotification.value.subject}" thành công`);
                this.router.navigate(['/notification/list']);
            },
            (error) => {
                 this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

    /*
        Function isQRCode(): set value is_QR_code and enable/disable input Location
        Author: Lam
    */
    isQRCode(event): void{
        if(event == "true"){
            this.check_Location = false;
            this.formNotification.get('is_QR_code').setValue(true);
        }else{
            this.check_Location = true;
            this.formNotification.get('location').setValue(null);
            this.formNotification.get('is_QR_code').setValue(false);
        }
    }

    /*
        Function changeCategory(): Check catrgory
        Author: Lam
    */
    changeCategory(event){
        let cate_id = parseInt(event.target.value);
        if(cate_id === 1){
            this.check_QR = false;
            this.check_Location = false;
            this.formNotification.get('is_QR_code').setValue(true);
            if(this.noti.id){
                this.formNotification.get('location').setValue(this.noti.location);
            }else{
                this.formNotification.get('location').setValue('Quầy MBS');
            }
        }else{
            this.check_QR = true;
            this.check_Location = true;
            this.formNotification.get('is_QR_code').setValue(false);
            this.formNotification.get('location').setValue(null);
        }
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
