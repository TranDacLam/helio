import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../../../shared/class/event';
import { EventService } from '../../../shared/services/event.service';
import { message } from '../../../shared/utils/message';
import 'rxjs/add/observable/throw';
import { ToastrService } from 'ngx-toastr';
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

    length_all: Number = 0;
    length_selected: Number = 0;

    events: Event[];   

    lang: string = 'vi';

    constructor(
        private eventService: EventService, 
        private route: ActivatedRoute, 
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.dtOptions = datatable_config.data_config('Sự Kiện');
        // custom datatable option
        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
            },
            columnDefs: [
                {
                    targets: 1,
                    visible: false
                },
                { 
                    orderable: false, 
                    targets: 0 
                }
            ]
        };
        // create new object from 2 object use operator spread es6
        this.dtOptions = {...this.dtOptions, ...dt_options_custom };

        this.getEvents();
    }

    /*
        Function getEvents(): Callback service function getEvents() get all Event
        Author: Lam
    */
    getEvents(){
        this.eventService.getEvents(this.lang).subscribe(
            (data) => {
                this.events = data;
                this.length_all = this.events.length;
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

    /*
        Event select checbox on row
            Case1: all row are checked then checkbox all on header is checked
            Case1: any row is not checked then checkbox all on header is not checked
        @author: Lam 
    */
    selectCheckbox(event) {   
        $(event.target).closest( "tr" ).toggleClass( "selected" );
        this.getLengthSelected();
        this.checkSelectAllCheckbox();
    }

    // input checkall checked/unchecked
    checkSelectAllCheckbox() {
        if($('#table_id tbody tr').hasClass('selected')){
            $('#select-all').prop('checked', $("#table_id tr.row-data:not(.selected)").length == 0);
        }else{
            $('#select-all').prop('checked', false);
        }
        this.getLengthSelected();
    }
    /*
        Event select All Button on header table
        @author: Lam 
    */
    selectAllEvent(event) {
        if( event.target.checked ) {
            $("#table_id tr").addClass('selected');
        } else {
            $("#table_id tr").removeClass('selected');
        }
        $("#table_id tr input:checkbox").prop('checked', event.target.checked);
        this.getLengthSelected();
    }

    /*
        Function getLengthSelected(): draw length selected
        @author: Lam
    */
    getLengthSelected(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            this.length_selected = dtInstance.rows('.selected').count();
        })
    }

    /*
        Function deleteEvent(): confirm delete
        @author: Lam
    */

    deleteEvent(){
        let that = this;
        if ( this.length_selected > 0 ) {
            bootbox.confirm({
                title: "Bạn có chắc chắn",
                message: "Bạn muốn xóa " + this.length_selected + " sự kiện đã chọn?",
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
            this.toastr.warning(`Vui lòng chọn sự kiện cần xóa`);
        }
        
    }

    /*
        Function onDelelteEvent(): 
         + Callback service function onDelelteEvent() delete event by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDeleteEvent(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list promotion id selected
            let get_list_id = dtInstance.cells('.selected', 1).data().toArray();
            // array string to array number
            let list_id_selected = get_list_id.map(Number);

            // Call API remove list promotion selected
            this.eventService.onDelEventSelect(list_id_selected, this.lang).subscribe(
                (data) => {
                    if (data.code === 204) {
                        this.toastr.success(`Xóa ${this.length_selected} sự kiện thành công`);

                        // Remove all promotion selected on UI
                        dtInstance.rows('.selected').remove().draw();
                        // Reset count promotion
                        this.length_all =  dtInstance.rows().count();
                        this.length_selected = 0;
                    } else {
                        this.router.navigate(['/error', { message: data.message}]);
                    }
                }, 
                (error) => {
                    this.router.navigate(['/error', { message: error.message}]);
                });
        });
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
        if(this.lang === 'vi'){
            $('.custom_table').attr('style', 'height: 640px');
            this.events = null;
            this.lang = 'en';
            this.getEvents();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }

}
