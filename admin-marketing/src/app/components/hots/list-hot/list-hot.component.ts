import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { Hot } from '../../../shared/class/hot';
import { HotService } from '../../../shared/services/hot.service';
import { message } from '../../../shared/utils/message';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'app-list-hot',
    templateUrl: './list-hot.component.html',
    styleUrls: ['./list-hot.component.css'],
    providers: [HotService]
})
export class ListHotComponent implements OnInit {

    /*
        Author: Lam
    */

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    hots: Hot[];
    hots_del = []; // Get array id to delete all id hot
    select_checked = false; // Check/uncheck all hot
    message_result = ''; // Message error

    constructor(private hotService: HotService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.getHots();

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
        Function getHots(): Callback service function getHots() get all Hot
        Author: Lam
    */
    getHots(){
        this.hotService.getHots().subscribe(
            (data) => {
                this.hots = data;
            } 
        );
    }

    /*
        Function onSelectCKB(): checked/uncheck add/delete id to array hots_del
        Author: Lam
    */
    onSelectCKB(event, value){
        if(event.target.checked){
            this.hots_del.push(value.id);
        }else{
            this.hots_del = this.hots_del.filter(k => k !== value.id);
        }
    }


    /*
        Function onSelectAll(): checked/uncheck add/delete all id hot to array hots_del
        Author: Lam
    */
    onSelectAll(event){
        this.hots_del = [];
        let array_del = [];
        if(event.target.checked){
            this.hots.forEach(function(element) {
                array_del.push(element.id);
            });
            this.hots_del = array_del;
            this.select_checked = true;
        }else{
            this.select_checked = false;
        }
    }

    /*
        Function deleteHotEvent(): confirm delete
        @author: Lam
    */
    deleteHotEvent(){
        let that = this;
        if ( this.hots.length > 0 ) {
            bootbox.confirm({
                title: "Bạn có chắc chắn",
                message: "Bạn muốn xóa " + this.hots_del.length + " phần tử đã chọn",
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
                        that.onDeleteHot();
                    }
                }
            });

        } else  {
            bootbox.alert("Vui lòng chọn phần tử cần xóa");
        }
        
    }

    /*
        Function onDelelteHot(): 
         + Callback service function onDelelteHot() delete hot by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDeleteHot(){
        this.hotService.onDelHotSelect(this.hots_del).subscribe(
            (data) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    this.hots_del.forEach(function(element) {
                        dtInstance.rows('#del-'+element).remove().draw();
                    });
                    this.hots_del = [];
                });
                this.getHots();
                this.message_result = 'Xóa thành công.';
            }
        );
    }
}
