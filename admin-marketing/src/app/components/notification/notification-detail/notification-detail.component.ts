import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/class/user';
import { Notification } from '../../../shared/class/notification';
import { NotificationService } from '../../../shared/services/notification.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/throw';

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

    constructor(
        private notificationService: NotificationService, 
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.getUserNotification();
    }

    /*
        Function getUserNotification():
         + Get id from url path
         + Callback service function getUserNotification() by id to get noti_detail, user_list_left, user_list_right
        Author: Lam
    */
    getUserNotification(): void{
        const id = +this.route.snapshot.paramMap.get('id');
        this.notificationService.getUserNotification(id).subscribe(
            (data) => {
                this.noti_detail = data.notification_detail;
                this.user_list_left = data.user_all;
                this.user_list_right = data.user_notification;
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
        this.notificationService.updateUserNoti(event).subscribe();
    }

}
