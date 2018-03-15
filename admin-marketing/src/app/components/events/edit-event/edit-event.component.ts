import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../../../shared/class/event';
import { EventService } from '../../../shared/services/event.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
  providers: [EventService]
})
export class EditEventComponent implements OnInit {

    event: Event;
    type_http = "put"; // type http to form event component 

    lang = 'vi';

    constructor(
        private eventService: EventService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
        this.getEvent();
    }

    /*
        Function getEvent():
         + Get id from url path
         + Callback service function getEvent() by id
        Author: Lam
    */
    getEvent(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.eventService.getEvent(id, this.lang).subscribe(
            (data) => {
                this.event = data;
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

}
