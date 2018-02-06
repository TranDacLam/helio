import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { Notification } from '../../../shared/class/notification';
import { NotificationService } from '../../../shared/services/notification.service';
import 'rxjs/add/observable/throw';


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

    notifications: Notification[];
    notifications_del = []; // Get array id to delete all id notification
    select_checked = false; // Check/uncheck all notification 
    message_result = ''; // Message error

    constructor(private notificationService: NotificationService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.getNotifications();

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
        Function getNotifications(): Callback service function getNotifications() get all Notification
        Author: Lam
    */
    getNotifications(){
        this.notificationService.getNotifications().subscribe(
            (data) => {
                this.notifications = data;
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
                });
            }
        );
    }

}
