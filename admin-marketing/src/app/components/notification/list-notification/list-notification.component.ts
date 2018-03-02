import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
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

    notifications: Notification[];
    notifications_del = []; // Get array id to delete all id notification
    length_notification: number;
    select_checked = false; // Check/uncheck all notification 
    message_result = ''; // Message error

    constructor(private notificationService: NotificationService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.dtOptions = datatable_config.data_config('Thông Báo').dtOptions;
        this.getNotifications();

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
        Function getNotifications(): Callback service function getNotifications() get all Notification
        Author: Lam
    */
    getNotifications(){
        this.notificationService.getNotifications().subscribe(
            (data) => {
                this.notifications = data;
                this.length_notification = this.notifications.length;
            } 
        );
    }

    /*
        Function onSelectCKB(): checked/uncheck add/delete id to array notifications_del
        Author: Lam
    */
    onSelectCKB(event, noti){
        if(event.target.checked){
            this.notifications_del.push(noti.id);
        }else{
            this.notifications_del = this.notifications_del.filter(k => k !== noti.id);
        }
    }

    /*
        Function onSelectAll(): checked/uncheck add/delete all id notification to array notifications_del
        Author: Lam
    */
    onSelectAll(event){
        this.notifications_del = [];
        let array_del = [];
        if(event.target.checked){
            this.notifications.forEach(function(element) {
                array_del.push(element.id);
            });
            this.notifications_del = array_del;
            this.select_checked = true;
        }else{
            this.select_checked = false;
        }
    }

    /*
        Function deleteNotificationEvent(): confirm delete
        @author: Lam
    */
    deleteNotificationEvent(){
        let that = this;
        if ( this.notifications_del.length > 0 ) {
            bootbox.confirm({
                title: "Bạn có chắc chắn",
                message: "Bạn muốn xóa " + this.notifications_del.length + " phần tử đã chọn",
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
            bootbox.alert("Vui lòng chọn phần tử cần xóa");
        }
        
    }

    /*
        Function onDelelteNoti(): 
         + Callback service function onDelNotiSelect() delete notification by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDelelteNoti(){
        this.notificationService.onDelNotiSelect(this.notifications_del).subscribe(
            (data) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    this.notifications_del.forEach(function(element) {
                        dtInstance.rows('#del-'+element).remove().draw();
                    });
                    this.length_notification = this.length_notification - this.notifications_del.length;
                    this.notifications_del = [];
                });
                this.message_result = 'Xóa thành công.';
            }
        );
    }

}
