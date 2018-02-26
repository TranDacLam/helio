import { Component, OnInit } from '@angular/core';
import { Notification } from '../../../shared/class/notification';

@Component({
    selector: 'add-notification',
    templateUrl: './add-notification.component.html',
    styleUrls: ['./add-notification.component.css']
})
export class AddNotificationComponent implements OnInit {

    noti: Notification = new Notification(); // create object notification
    method = "post"; // type http to form notification component 

    constructor() { }

    ngOnInit() {
    }

}
