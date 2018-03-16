import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/class/user';
import { Notification } from '../../../shared/class/notification';
import { NotificationService } from '../../../shared/services/notification.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VariableGlobals } from './../../../shared/commons/variable_globals';
import 'rxjs/add/observable/throw';


declare var bootbox:any;

@Component({
    selector: 'app-notification-detail',
    templateUrl: './notification-detail.component.html',
    styleUrls: ['./notification-detail.component.css'],
    providers: [NotificationService]
})
export class NotificationDetailComponent implements OnInit {

    /*
        Author: Lam
    */

    noti_detail: Notification;
    user_list_left: User[]; // List user not selected
    user_list_right: User[]; // List user selected

    is_update: boolean = false; // Check input checkbox Update Notification
    messageSuccess = '';
    messageError = '';
    user_current: User;

    lang = 'vi';

    constructor(
        private notificationService: NotificationService, 
        private route: ActivatedRoute,
        private router: Router,
        private variable_globals: VariableGlobals
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });

        this.getUserNotification();
        setTimeout(()=>{
            this.user_current = this.variable_globals.user_current;
        },100);
        
    }

    /*
        Function getUserNotification():
         + Get id from url path
         + Callback service function getUserNotification() by id to get noti_detail, user_list_left, user_list_right
        Author: Lam
    */
    getUserNotification(): void{
        const id = +this.route.snapshot.paramMap.get('id');
        this.notificationService.getUserNotification(id, this.lang).subscribe(
            (data) => {
                this.noti_detail = data.notification_detail;
                this.user_list_left = data.user_all;
                this.user_list_right = data.user_notification;
            }
        );

    }

    /*
        Function getNotification():
         + Get id from url path
         + Callback service function getNotification() by id
        Author: Lam
    */
    getNotification(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.notificationService.getNotification(id, this.lang).subscribe(
            (data) => {
                this.noti_detail = data;
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

    /*
        Function isUpdateNoti(): enable/disable button Update Notification
        Author: Lam
    */
    isUpdateNoti(event){
        if(event.target.checked){
            this.is_update = true;
        }else{
            this.is_update = false;
        }
    }

    /*
        Function updateNoti(): Get notification from component popup-edit-notification
        Author: Lam
    */
    updateNoti(event){
        this.noti_detail = event;
    }

    /*
        Function update_user_noti(): Callback service function updateUserNoti() to update user selected/no selected
        Author: Lam
    */
    update_user_noti(event){
        if(!this.noti_detail.sent_date || (this.user_current.role === 1 && this.noti_detail.sent_date)){
            if(event.length > 0){
                const id = +this.route.snapshot.paramMap.get('id');
                this.notificationService.updateUserNoti(id, event, this.lang).subscribe(
                    (data) => {
                        this.messageSuccess = "Lưu thành công.";
                        setTimeout(()=>{
                              this.messageSuccess = '';
                        },5000);
                    },
                    (error) => {
                        this.messageSuccess = error.message;
                    }
                );
            }else{
                bootbox.alert("Vui lòng chọn user");
            }
        }else{
            bootbox.alert("Chức năng này chỉ dành cho System Admin");
        }
        
        
    }

    /*
        Function checkSendNotification(): confirm delete
        @author: Lam
    */
    checkSendNotification(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn",
            message: "Bạn có muốn gửi thông báo này không?",
            buttons: {
                cancel: {
                    label: "Hủy"
                },
                confirm: {
                    label: "Đồng Ý"
                }
            },
            callback: function (result) {
                if(result) {
                    that.sendNotification();
                }
            }
        });
    }

    /*
        Function sendNotification(): call service function sendNotification() send notification by notification_id
        @author: Lam
    */
    sendNotification(){
        const id = this.noti_detail.id;
        this.notificationService.sendNotification(id, this.lang).subscribe(
            (data) => {
                this.getNotification();
                this.messageSuccess = data.message;
                setTimeout(()=>{
                      this.messageSuccess = '';
                },10000);
            },
            (error) => {
                this.messageError = error.message;
                setTimeout(()=>{
                      this.messageError = '';
                },10000);
            }
        );
    }

}
