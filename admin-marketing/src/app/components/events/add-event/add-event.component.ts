import { Component, OnInit } from '@angular/core';
import { Event } from '../../../shared/class/event';

@Component({
    selector: 'app-add-event',
    templateUrl: './add-event.component.html',
    styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

    event: Event = new Event(); // create object notification
    type_http = "post"; // type http to form notification component 

    constructor() { }

    ngOnInit() {
    }

}
