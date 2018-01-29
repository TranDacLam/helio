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

    notification: User;
    user_all: User[];
    user_promotion: User[];

    constructor(
        private notificationService: NotificationService, 
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.getUserNotification();
    }

    getNotification(): void{
        const id = +this.route.snapshot.paramMap.get('id');
        this.notificationService.getNotification(id).subscribe(
            (noti) => {
                console.log(noti);
                this.notification = noti;
            }
        );
    }   

    getUserNotification(): void{
        const id = +this.route.snapshot.paramMap.get('id');
        this.notificationService.getUserNotification(id).subscribe(
            (data) => {
                console.log(data);
                this.user_all = data.user_all;
                this.user_promotion = data.user_promotion;
            }
        );

    }

}
