import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { Notification } from '../../../shared/class/notification';
import { NotificationService } from '../../../shared/services/notification.service';
import { message } from '../../../shared/utils/message';
import 'rxjs/add/observable/throw';
import * as datatable_config from '../../../shared/commons/datatable_config';

declare var bootbox:any;

@Component({
    selector: 'app-list-notification',
    templateUrl: './list-notification.component.html',
    styleUrls: ['./list-notification.component.css'],
    providers: [NotificationService]
})
export class ListNotificationComponent implements OnInit {

    /*
        Author: Lam
    */

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: any = {};

    length_all: Number = 0;
    length_selected: Number = 0;

    notifications: Notification[];

    message_result = ''; // Message error
    errorMessage = '';

    lang: string = 'vi';

    constructor(private notificationService: NotificationService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.dtOptions = datatable_config.data_config('Thông Báo');
        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
            },
            columnDefs: [
                { 
                    orderable: false, 
                    targets: 0 
                }
            ]
        };
        this.dtOptions = {...this.dtOptions, ...dt_options_custom };

        this.getNotifications();

        /*
            Use route to get params from url
            Author: Lam
        */
        this.route.params.subscribe(params => {
            if(params.message_put){
                this.message_result = `${message.edit} "${params.message_put}" ${message.success}`;
            }else if(params.message_post){
                this.message_result = `${message.create_new} "${params.message_post}" ${message.success}`;
            }else if(params.message_del){
                this.message_result = 'Xóa thông báo thành công.';
            }
        });
    }

    /*
        Function getNotifications(): Callback service function getNotifications() get all Notification
        Author: Lam
    */
    getNotifications(){
        this.notificationService.getNotifications(this.lang).subscribe(
            (data) => {
                this.notifications = data;
                this.length_all = this.notifications.length;
            },
            (error) => {
                if(error.code === 400){
                    this.errorMessage = error.message;
                }else{
                    this.router.navigate(['/error']);
                }
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
        $('#select-all').prop('checked', $("#table_id tr.row-data:not(.selected)").length == 0);
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
        Function deleteNotificationEvent(): confirm delete
        @author: Lam
    */
    deleteNotificationEvent(){
        let that = this;
        if ( this.length_selected > 0 ) {
            bootbox.confirm({
                title: "Bạn có chắc chắn",
                message: "Bạn muốn xóa " + this.length_selected + " thông báo đã chọn",
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
                        that.onDelelteNoti();
                    }
                }
            });

        } else  {
            bootbox.alert("Vui lòng chọn thông báo cần xóa");
        }
        
    }

    /*
        Function onDelelteNoti(): 
         + Callback service function onDelNotiSelect() delete notification by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDelelteNoti(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list promotion id selected
            let get_list_id = dtInstance.cells('.selected', 1).data().toArray();
            // array string to array number
            let list_id_selected = get_list_id.map(Number);

            // Call API remove list promotion selected
            this.notificationService.onDelNotiSelect(list_id_selected, this.lang).subscribe(
                (data) => {
                    if (data.code === 204) {
                        this.message_result = "Xóa "+ this.length_selected + " thông báo thành công"

                        // Remove all promotion selected on UI
                        dtInstance.rows('.selected').remove().draw();
                        // Reset count promotion
                        this.length_all =  dtInstance.rows().count();
                        this.length_selected = 0;
                        this.errorMessage = '';
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
            this.notifications = null;
            this.lang = 'vi';
            this.getNotifications();
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
            this.notifications = null;
            this.lang = 'en';
            this.getNotifications();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }

}
