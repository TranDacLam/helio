import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Notification } from '../../../shared/class/notification';
import { NotificationService } from '../../../shared/services/notification.service';
import 'rxjs/add/observable/throw';

@Component({
    selector: 'form-notification',
    templateUrl: './form-notification.component.html',
    styleUrls: ['./form-notification.component.css'],
    providers: [NotificationService]
})
export class FormNotificationComponent implements OnInit {

    @ViewChild('inputImage')
    inputImage: any;

    formNotification: FormGroup;
    noti = new Notification();

    check_QR: boolean = true;

    constructor(
        private notificationService: NotificationService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.creatForm();
    }

    creatForm(){
        this.formNotification = this.fb.group({
            subject: [this.noti.subject, [Validators.required]],
            message: [this.noti.message, [Validators.required]],
            image: [this.noti.image, [Validators.required]],
            sub_url: [this.noti.sub_url, Validators.required],
            category: [this.noti.category, Validators.required],
            is_QR_code: [false, Validators.required],
            location: [this.noti.location, Validators.required],
        });
    }

    onFileChange(event): void{
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.formNotification.get('image').setValue({
                    filename: file.name,
                    filetype: file.type,
                    value: reader.result.split(',')[1]
                })
            };
        }
    }

    clearFile() {
        this.formNotification.get('image').setValue(null);
        this.inputImage.nativeElement.value = "";
    }

    onSubmit(){
        console.log(this.formNotification.value);
    }

    isQRCode(event){
        if(event == "true"){
            this.check_QR = false;
            this.formNotification.get('is_QR_code').setValue(true);
        }else{
            this.check_QR = true;
            this.formNotification.get('is_QR_code').setValue(false);
        }
    }

}
