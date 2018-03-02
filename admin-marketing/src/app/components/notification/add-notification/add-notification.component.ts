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

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
    	/*
            Use route to get params from url
            Author: Lam
        */
        this.route.queryParams.subscribe(params => {
            if(params.promotion) {
            	this.noti.promotion  = +params.promotion;
            }
            console.log(this.noti.promotion);
        });
    }

}
