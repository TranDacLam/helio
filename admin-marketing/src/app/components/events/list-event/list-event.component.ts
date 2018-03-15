import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../../../shared/class/event';
import { EventService } from '../../../shared/services/event.service';
import { message } from '../../../shared/utils/message';
import 'rxjs/add/observable/throw';
import * as datatable_config from '../../../shared/commons/datatable_config';


declare var bootbox:any;

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

    dtOptions: any = {};

    events: Event[];
    events_del = []; // Get array id to delete all id event
    length_events: number;
    select_checked = false; // Check/uncheck all event
    message_result = ''; // Message success
    errorMessage = '';

    lang: string = 'vi';

    constructor(
        private eventService: EventService, 
        private route: ActivatedRoute, 
        private router: Router,
    ) { }

    ngOnInit() {
        this.dtOptions = datatable_config.data_config('Sự Kiện').dtOptions;
        this.getEvents();

        /*
            Use route to get params from url
            Author: Lam
        */
        this.route.params.subscribe(params => {
            if(params.message_put){
                this.message_result = `${message.edit} ${params.message_put} ${message.success}`;
            }else if(params.message_post){
                this.message_result = `${message.create_new} ${params.message_post} ${message.success}`;
            }else if(params.message_del){
                this.message_result = 'Xóa thành công.';
            }
        });
    }

    /*
        Function getEvents(): Callback service function getEvents() get all Event
        Author: Lam
    */
    getEvents(){
        this.eventService.getEvents(this.lang).subscribe(
            (data) => {
                this.events = data;
                this.length_events = this.events.length;
            },
            (error) => {
                if(error.code === 403){
                    this.errorMessage = error.message;
                }else{
                    this.router.navigate(['/error', { message: error.message}]);
                }
            }
        );
    }

    /*
        Function onSelectCKB(): checked/uncheck add/delete id to array events_del
        Author: Lam
    */
    onSelectCKB(event, value){
        if(event.target.checked){
            this.events_del.push(value.id);
        }else{
            this.events_del = this.events_del.filter(k => k !== value.id);
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
        Function deleteEvent(): confirm delete
        @author: Lam
    */
    deleteEvent(){
        let that = this;
        if ( this.events_del.length > 0 ) {
            bootbox.confirm({
                title: "Bạn có chắc chắn",
                message: "Bạn muốn xóa " + this.events_del.length + " phần tử đã chọn",
                buttons: {
                    cancel: {
                        label: "Hủy"
                    },
                    confirm: {
                        label: "Xóa"
                    }
                },
                callback: function (result) {
                    if(result) {
                        that.onDeleteEvent();
                    }
                }
            });

        } else  {
            bootbox.alert("Vui lòng chọn phần tử cần xóa");
        }
        
    }

    /*
        Function onDelelteEvent(): 
         + Callback service function onDelelteEvent() delete event by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDeleteEvent(){
        this.eventService.onDelEventSelect(this.events_del, this.lang).subscribe(
            (data) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    this.events_del.forEach(function(element) {
                        dtInstance.rows('#del-'+element).remove().draw();
                    });
                    this.length_events = this.length_events - this.events_del.length;
                    this.events_del = [];
                });
                this.select_checked = false;
                this.message_result = 'Xóa thành công.';
            }
        );
    }


    /*
        Function changeLangVI(): Change language and callback service getEvents()
        Author: Lam
    */
    changeLangVI(){
        if(this.lang === 'en'){
            $('.custom_table').attr('style', 'height: 640px');
            this.events = null;
            this.lang = 'vi';
            this.getEvents();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }

    /*
        Function changeLangEN(): Change language and callback service getEvents()
        Author: Lam
    */
    changeLangEN(){
        $('.custom_table').attr('style', 'height: 640px');
        if(this.lang === 'vi'){
            this.events = null;
            this.lang = 'en';
            this.getEvents();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }

}
