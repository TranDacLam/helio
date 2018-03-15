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

    lang: string;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
    	/*
            Use route to get params promotion id from url
            Author: Lam
        */
        this.route.params.subscribe(params => {
            if(params.promotion){
                this.promotion_id = +params.promotion;
            }
            if(params.promotion){
                this.lang = params.lang;
            }
        });
    }

}
