import { Component, OnInit, ViewChild, QueryList } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { PromotionService } from '../../../shared/services/promotion.service';
import { Promotion } from '../../../shared/class/promotion';
import * as datatable_config from '../../../shared/commons/datatable_config';
import { ToastrService } from 'ngx-toastr';
import { env } from '../../../../environments/environment';

declare var bootbox:any;
declare var $: any;

@Component({
    selector: 'app-list-promotion',
    templateUrl: './list-promotion.component.html',
    styleUrls: ['./list-promotion.component.css'],
    providers: [
        PromotionService
    ]
})

/*
    ListPromotionComponent
    @author: diemnguyen 
*/ 
export class ListPromotionComponent implements OnInit {
    dtOptions: any = {};

	promotion_list: Promotion[];


    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    length_all: Number = 0;
    length_selected: Number = 0;

    message_result: string = "";

    api_domain:string = "";
    lang: string = 'vi';

    /*
        Using trigger becase fetching the list of feedbacks can be quite long
        thus we ensure the data is fetched before rensering
    */ 

    constructor(
        private promotionService: PromotionService,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) { 
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
    	this.getAllPromotion();
        this.dtOptions = datatable_config.data_config('Khuyến Mãi');
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
    }

    /*
        Call Service get all promotion
        @author: diemnguyen 
    */
    getAllPromotion() {
        this.promotionService.getAllPromotion(this.lang).subscribe(
            (data) => {
                this.promotion_list = data;
                this.length_all = data.length;
            }, 
            (error) => {
                this.router.navigate(['/error', {message: error.message}]);
            });
    }

    /*
        Event select checbox on row
            Case1: all row are checked then checkbox all on header is checked
            Case1: any row is not checked then checkbox all on header is not checked
        @author: diemnguyen 
    */
    selectCheckbox(event) {   
        $(event.target).closest( "tr" ).toggleClass( "selected" );
        this.getLengthSelected();
        this.checkSelectAllCheckbox();
    }

    checkSelectAllCheckbox() {
        $('#select-all').prop('checked', $("#table_id tr.row-data:not(.selected)").length == 0);
        this.getLengthSelected();
    }
    /*
        Event select All Button on header table
        @author: diemnguyen 
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

    getLengthSelected(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            this.length_selected = dtInstance.rows('.selected').count();
        })
    }

    /*
        Delete promotion selected list
        @author: diemnguyen
    */
    deletePromotionListEvent(){
        let that = this;
        if ( this.length_selected > 0 ) {
            bootbox.confirm({
                title: "Bạn có chắc chắn",
                message: "Bạn muốn xóa " + this.length_selected + " khuyến mãi đã chọn",
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
                        that.deletePromotionList();
                    }
                }
            });

        } else  {
            this.toastr.warning(`Vui lòng chọn khuyến mãi cần xóa`);
        }
        
    }

    generator_QR_code(event , id: number) {
        let element = $(event.target);
        element.button('loading');
        this.promotionService.generator_QR_code(id).subscribe(
            (data) => {
                if(data.status == 200) {
                    let body = data.json(); 
                    var promotion = this.promotion_list.find( promotion => promotion.id == id);
                    promotion.QR_code = body.qr_code_url;
                }
                element.button('reset');
            }, 
            (error) => {
                this.router.navigate(['/error']);
            });
    }

    /*
        Delete promotion selected list
        @author: diemnguyen
    */
    private deletePromotionList() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list promotion id selected
            let list_id_selected = dtInstance.cells('.selected', 1).data().toArray();
            console.log(list_id_selected);
            // Call API remove list promotion selected
            this.promotionService.deletePromotionList(list_id_selected, this.lang).subscribe(
                (data) => {
                    if (data.status == 204) {
                        this.toastr.success(`Xóa ${this.length_selected} khuyến mãi thành công`);

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
            this.promotion_list = null;
            this.lang = 'vi';
            this.getAllPromotion();
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
            this.promotion_list = null;
            this.lang = 'en';
            this.getAllPromotion();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }

}
