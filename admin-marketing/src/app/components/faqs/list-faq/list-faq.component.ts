import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { Faq } from '../../../shared/class/faq';
import { FaqService } from '../../../shared/services/faq.service';
import { message } from '../../../shared/utils/message';
import 'rxjs/add/observable/throw';

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

    faqs: Faq[];
    faqs_del = []; // Get array id to delete all id faq
    length_faqs: number;
    select_checked = false; // Check/uncheck all faq
    message_result = ''; // Message error

    constructor(private faqService: FaqService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.getFaqs();

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
        Function getFaqs(): Callback service function getFaqs() get all Faq
        Author: Lam
    */
    getFaqs(){
        this.faqService.getFaqs().subscribe(
            (data) => {
                this.faqs = data;
                this.length_faqs = this.faqs.length;
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
                message: "Bạn muốn xóa " + this.faqs_del.length + " phần tử đã chọn",
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
            bootbox.alert("Vui lòng chọn phần tử cần xóa");
        }
        
    }

    /*
        Function onDelelteFaq(): 
         + Callback service function onDelelteFaq() delete faq by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDelelteFaq(){
        this.faqService.onDelFaqSelect(this.faqs_del).subscribe(
            (data) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    this.faqs_del.forEach(function(element) {
                        dtInstance.rows('#del-'+element).remove().draw();
                    });
                    this.length_faqs = this.length_faqs - this.faqs_del.length;
                    this.faqs_del = [];
                });
                this.message_result = "Xóa thành công."
            }
        );
    }

}
