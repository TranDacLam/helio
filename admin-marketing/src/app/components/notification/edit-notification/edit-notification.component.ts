import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from '../../../shared/class/notification';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
    selector: 'app-edit-notification',
    templateUrl: './edit-notification.component.html',
    styleUrls: ['./edit-notification.component.css'],
    providers: [NotificationService]
})
export class EditNotificationComponent implements OnInit {

    noti: Notification;
    type_http = "put"; // type http to form notification component 

    constructor(
        private notificationService: NotificationService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.getNotification();
    }

    /*
        Function getNotification():
         + Get id from url path
         + Callback service function getNotification() by id
        Author: Lam
    */
    getNotification(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.notificationService.getNotification(id).subscribe(
            (data) => {
                this.noti = data;
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

}
