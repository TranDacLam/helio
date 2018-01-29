import { Component, OnInit } from '@angular/core';
import { Notification } from '../../../shared/class/notification';
import { NotificationService } from '../../../shared/services/notification.service';
import 'rxjs/add/observable/throw';


@Component({
    selector: 'app-list-notification',
    templateUrl: './list-notification.component.html',
    styleUrls: ['./list-notification.component.css'],
    providers: [NotificationService]
})
export class ListNotificationComponent implements OnInit {

    notifications: Notification[];
    notifications_del = [];
    select_checked = false;

    constructor(private notificationService: NotificationService) { }

    ngOnInit() {
        this.getNotifications();
    }

    getNotifications(){
        this.notificationService.getNotifications().subscribe(
            (data) => {
                this.notifications = data;
            } 
        );
    }

    onSelectCKB(event, noti){
        if(event.target.checked){
            this.notifications_del.push(noti.id);
        }else{
            this.notifications_del = this.notifications_del.filter(k => k !== noti.id);
        }
    }

    onSelectAll(event){
        this.notifications_del = [];
        let array_del = [];
        if(event.target.checked){
            this.notifications.forEach(function(element) {
                array_del.push(element.id);
            });
            this.notifications_del = array_del;
            this.select_checked = true;
        }else{
            this.select_checked = false;
        }
    }

    onDelelteNoti(){
        this.notificationService.onDelelteNoti(this.notifications_del).subscribe();
    }

}
