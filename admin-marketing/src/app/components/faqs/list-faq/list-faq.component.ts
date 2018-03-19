import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { Faq } from '../../../shared/class/faq';
import { FaqService } from '../../../shared/services/faq.service';
import { message } from '../../../shared/utils/message';
import 'rxjs/add/observable/throw';
import * as datatable_config from '../../../shared/commons/datatable_config';

declare var bootbox:any;

@Component({
    selector: 'app-list-faq',
    templateUrl: './list-faq.component.html',
    styleUrls: ['./list-faq.component.css'],
    providers: [FaqService]
})
export class ListFaqComponent implements OnInit {

    /*
        Author: Lam
    */

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: any = {};

    faqs: Faq[];
    faqs_del = []; // Get array id to delete all id faq
    length_faqs: number;
    select_checked = false; // Check/uncheck all faq
    message_result = ''; // Message error
    errorMessage: any;

    lang: string = 'vi';

    constructor(private faqService: FaqService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.dtOptions = datatable_config.data_config('Câu Hỏi Thường Gặp').dtOptions;
        this.getFaqs();

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
                this.message_result = 'Xóa câu hỏi thường gặp thành công.';
            }
        });
    }

    /*
        Function getFaqs(): Callback service function getFaqs() get all Faq
        Author: Lam
    */
    getFaqs(){
        this.faqService.getFaqs(this.lang).subscribe(
            (data) => {
                this.faqs = data;
                this.length_faqs = this.faqs.length;
            },
            (error) => {
                if(error.code === 400){
                    this.errorMessage = error.message;
                }else{
                    this.router.navigate(['/error', { message: error.message}]);
                }
            }
        );
    }

    /*
        Function onSelectCKB(): checked/uncheck add/delete id to array faqs_del
        Author: Lam
    */
    onSelectCKB(event, faq){
        if(event.target.checked){
            this.faqs_del.push(faq.id);
        }else{
            this.faqs_del = this.faqs_del.filter(k => k !== faq.id);
        }
    }

    /*
        Function onSelectAll(): checked/uncheck add/delete all id faq to array faqs_del
        Author: Lam
    */
    onSelectAll(event){
        this.faqs_del = [];
        let array_del = [];
        if(event.target.checked){
            this.faqs.forEach(function(element) {
                array_del.push(element.id);
            });
            this.faqs_del = array_del;
            this.select_checked = true;
        }else{
            this.select_checked = false;
        }
    }

    /*
        Function deleteFaqEvent(): confirm delete
        @author: Lam
    */
    deleteFaqEvent(){
        let that = this;
        if ( this.faqs_del.length > 0 ) {
            bootbox.confirm({
                title: "Bạn có chắc chắn",
                message: "Bạn muốn xóa " + this.faqs_del.length + " câu hỏi thường gặp đã chọn",
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
                        that.onDelelteFaq();
                    }
                }
            });

        } else  {
            bootbox.alert("Vui lòng chọn câu hỏi thường gặp cần xóa");
        }
        
    }

    /*
        Function onDelelteFaq(): 
         + Callback service function onDelelteFaq() delete faq by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDelelteFaq(){
        this.faqService.onDelFaqSelect(this.faqs_del, this.lang).subscribe(
            (data) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    this.faqs_del.forEach(function(element) {
                        dtInstance.rows('#del-'+element).remove().draw();
                    });
                    this.message_result = "Xóa "+ this.faqs_del.length +" câu hỏi thường gặp thành công."
                    this.length_faqs = this.length_faqs - this.faqs_del.length;
                    this.faqs_del = [];
                });
                this.select_checked = false;
                this.errorMessage = '';
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
            this.faqs = null;
            this.lang = 'vi';
            this.getFaqs();
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
            this.faqs = null;
            this.lang = 'en';
            this.getFaqs();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }

}
