import { Component, OnInit } from '@angular/core';
import { Notification } from '../../../shared/class/notification';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'add-notification',
    templateUrl: './add-notification.component.html',
    styleUrls: ['./add-notification.component.css']
})
export class AddNotificationComponent implements OnInit {

    noti: Notification = new Notification(); // create object notification
    type_http = "post"; // type http to form notification component
    promotion_id: number; // get id promotion

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
    	/*
            Use route to get params promotion id from url
            Author: Lam
        */
        const id = +this.route.snapshot.queryParamMap.get('promotion');
        if(id > 0){
            this.promotion_id = id;
        }
    }

}
