import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { Event } from '../../../shared/class/event';
import { EventService } from '../../../shared/services/event.service';
import 'rxjs/add/observable/throw';

@Component({
    selector: 'app-list-event',
    templateUrl: './list-event.component.html',
    styleUrls: ['./list-event.component.css'],
    providers: [EventService]
})
export class ListEventComponent implements OnInit {

    /*
        Author: Lam
    */

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    events: Event[];
    events_del = []; // Get array id to delete all id event
    select_checked = false; // Check/uncheck all event
    message_result = ''; // Message error

    constructor(private eventService: EventService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.getEvents();

        /*
            Use route to get params from url
            Author: Lam
        */
        this.route.params.subscribe(params => {
            if(params.message_put){
                this.message_result = "Chình sửa "+ params.message_put + " thành công.";
            }else if(params.message_post){
                this.message_result = "Tạo mới "+ params.message_post + " thành công.";
            }
        });
    }

    /*
        Function getEvents(): Callback service function getEvents() get all Event
        Author: Lam
    */
    getEvents(){
        this.eventService.getEvents().subscribe(
            (data) => {
                this.events = data;
            } 
        );
    }

    /*
        Function onSelectCKB(): checked/uncheck add/delete id to array events_del
        Author: Lam
    */
    onSelectCKB(event, noti){
        if(event.target.checked){
            this.events_del.push(noti.id);
        }else{
            this.events_del = this.events_del.filter(k => k !== noti.id);
        }
    }

    /*
        Function onSelectAll(): checked/uncheck add/delete all id event to array events_del
        Author: Lam
    */
    onSelectAll(event){
        this.events_del = [];
        let array_del = [];
        if(event.target.checked){
            this.events.forEach(function(element) {
                array_del.push(element.id);
            });
            this.events_del = array_del;
            this.select_checked = true;
        }else{
            this.select_checked = false;
        }
    }

    /*
        Function onDelelteEvent(): 
         + Callback service function onDelelteEvent() delete event by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDelelteEvent(){
        this.eventService.onDelEventSelect(this.events_del).subscribe(
            (data) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    this.events_del.forEach(function(element) {
                        dtInstance.rows('#del-'+element).remove().draw();
                    });
                });
            }
        );
    }

}
