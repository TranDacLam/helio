import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { Hot } from '../../../shared/class/hot';
import { HotService } from '../../../shared/services/hot.service';
import { message } from '../../../shared/utils/message';
import 'rxjs/add/observable/throw';
import * as datatable_config from '../../../shared/commons/datatable_config';

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

    dtOptions: any = {};

    hots: Hot[];
    hots_del = []; // Get array id to delete all id hot
    length_hots: number;
    select_checked = false; // Check/uncheck all hot
    message_result = ''; // Message error
    errorMessage = '';

    lang: string = 'vi';

    constructor(private hotService: HotService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.dtOptions = datatable_config.data_config('Hot').dtOptions;
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
        this.hotService.getHots(this.lang).subscribe(
            (data) => {
                this.hots = data;
                this.length_hots = this.hots.length;
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
        if ( this.hots_del.length > 0 ) {
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
        this.hotService.onDelHotSelect(this.hots_del, this.lang).subscribe(
            (data) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    this.hots_del.forEach(function(element) {
                        dtInstance.rows('#del-'+element).remove().draw();
                    });
                    this.length_hots = this.length_hots - this.hots_del.length;
                    this.hots_del = [];
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
            this.hots = null;
            this.lang = 'vi';
            this.getHots();
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
            this.hots = null;
            this.lang = 'en';
            this.getHots();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }
}
