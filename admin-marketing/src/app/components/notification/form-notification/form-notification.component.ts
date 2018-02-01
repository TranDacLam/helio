import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Notification } from '../../../shared/class/notification';
import { NotificationService } from '../../../shared/services/notification.service';
import 'rxjs/add/observable/throw';

declare var $ :any; // declare Jquery

@Component({
    selector: 'form-notification',
    templateUrl: './form-notification.component.html',
    styleUrls: ['./form-notification.component.css'],
    providers: [NotificationService]
})
export class FormNotificationComponent implements OnInit {

    /*
        author: Lam
    */

    @ViewChild('inputImage')
    inputImage: any;

    @Input() noti: Notification; // Get notification from component parent
    @Input() type_http; // Get type http from component parent
    
    // Return 1 object to parent
    @Output() update_noti: EventEmitter<Notification> = new EventEmitter<Notification>();

    formNotification: FormGroup;

    check_QR: boolean = true; // Check enable/disable input Location

    errorMessage = ''; // Messages error

    constructor(
        private notificationService: NotificationService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.creatForm();
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formNotification = this.fb.group({
            subject: [this.noti.subject, [Validators.required, Validators.minLength(4)]],
            message: [this.noti.message, [Validators.required]],
            image: [this.noti.image],
            sub_url: [this.noti.sub_url, Validators.required],
            category: [1, Validators.required],
            is_QR_code: [false],
            location: [this.noti.location],
        });
    }

    /*
        Function onFileChange(): Input file image to get base 64
        author: Lam
    */ 
    onFileChange(event): void{
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.formNotification.get('image').setValue(reader.result.split(',')[1]);
            };
        }
    }

    /*
        Function clearFile(): Clear value input file image
        author: Lam
    */ 
    clearFile(): void {
        this.formNotification.get('image').setValue(null);
        this.inputImage.nativeElement.value = "";
    }

    /*
        Function onSubmit():
         + Step 1: Check type_http add notification (post), edit notification (put), edit use modal (put_popup)
         + Step 2:  
            * TH1:  + Type_http = post, callback service function addNoti() to add Notification, 
                    + Later, redirect list notification with message
            * TH2:  + Type_http = put or put_popup, callback service function updateNoti() to update Notification
                    + Type_http = put then redirect list notification with message
                    + Type_http = put_popup then update Notification show and hidden modal  
        author: Lam
    */ 
    onSubmit(): void{
        if(this.type_http == 'post'){
            this.notificationService.addNoti(this.formNotification.value).subscribe(
                (data) => {
                    this.router.navigate(['/notifications', { message_post: this.formNotification.value.subject}]);
                },
                (error) => {
                    { this.errorMessage = error.message; } 
                }
            );
        }else if(this.type_http == 'put' || this.type_http == 'put_popup'){
            this.notificationService.updateNoti(this.formNotification.value, this.noti.id).subscribe(
                (data) => {
                    this.noti = data;
                    if(this.type_http == "put"){
                        this.router.navigate(['/notifications', { message_put: this.formNotification.value.subject}]);
                    }else if(this.type_http == 'put_popup'){
                        this.getNotification();
                        $('#UpdateNoti').modal('toggle');
                    }
                },
                (error) => {
                    { this.errorMessage = error.message; } 
                }
            );
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
        this.notificationService.getNotification(id).subscribe(data => {
            this.noti = data;
            this.update_noti.emit(this.noti);
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
        this.notificationService.onDelNoti(id).subscribe();
        this.router.navigate(['/notifications']);
    }

    /*
        Function isQRCode(): set value is_QR_code and enable/disable input Location
        Author: Lam
    */
    isQRCode(event): void{
        if(event == "true"){
            this.check_QR = false;
            this.formNotification.get('is_QR_code').setValue(true);
        }else{
            this.check_QR = true;
            this.formNotification.get('is_QR_code').setValue(false);
        }
    }

}
