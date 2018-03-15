import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification } from '../../../shared/class/notification';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
    selector: 'popup-edit-notification',
    templateUrl: './popup-edit-notification.component.html',
    styleUrls: ['./popup-edit-notification.component.css'],
    providers: [NotificationService]
})
export class PopupEditNotificationComponent implements OnInit {

    /*
        Author: Lam
    */

    // Return 1 object to parent
    @Output() update_noti: EventEmitter<Notification> = new EventEmitter<Notification>();

    noti: Notification;
    type_http = "put_popup"; // type http to form notification component 

    lang = 'vi';

    constructor(
        private notificationService: NotificationService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
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
        this.notificationService.getNotification(id, this.lang).subscribe(data => {
            this.noti = data;
        });
    }

    /*
        Function updateNoti(): Get notification from component form-notification
        Author: Lam
    */
    updateNoti(event){
        this.update_noti.emit(event);
    }

}
