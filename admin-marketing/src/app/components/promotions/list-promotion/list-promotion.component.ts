import { Component, OnInit, ViewChild, QueryList } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PromotionService } from '../../../shared/services/promotion.service';
import { Promotion } from '../../../shared/class/promotion';
import * as datatable_config from '../../../shared/commons/datatable_config';
import { ToastrService } from 'ngx-toastr';
import { VariableGlobals } from './../../../shared/commons/variable_globals';
import { User } from '../../../shared/class/user';
import { env } from '../../../../environments/environment';
import { CustomizeDataTable } from './../../../shared/commons/customize_datatable';

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
    user_current: User;

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
        private variable_globals: VariableGlobals,
        private toastr: ToastrService,
        private datePipe: DatePipe,
        private customizeDatatable: CustomizeDataTable,
    ) { 
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
    	this.getAllPromotion();
        this.dtOptions = datatable_config.data_config('Khuyến Mãi');
        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
                this.customizeDatatable.dataTableSorting();
            },
            columnDefs: [
                { 
                    orderable: false, 
                    targets: 0 
                }
            ]
        };
        this.dtOptions = {...this.dtOptions, ...dt_options_custom };
        setTimeout(()=>{
            this.user_current = this.variable_globals.user_current;
        },100);
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
        if($('#table_id tbody tr').hasClass('selected')){
             $('#select-all').prop('checked', $("#table_id tr.row-data:not(.selected)").not("#table_id .disabled_checkbox").length == 0);
        }else{
            $('#select-all').prop('checked', false);
        }
        this.getLengthSelected();
    }
    /*
        Event select All Button on header table
        @author: diemnguyen 
    */
    selectAllEvent(event) {
        if( event.target.checked ) {
            $("#table_id tr").addClass('selected');
            if($("#table_id tr").hasClass('disabled_checkbox')){
                $("#table_id .disabled_checkbox").removeClass('selected');
            }
        } else {
            $("#table_id tr").removeClass('selected');
        }
        $("#table_id tr input:checkbox").not("#table_id .disabled_checkbox input:checkbox").prop('checked', event.target.checked);
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
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.length_selected + " Khuyến Mãi đã chọn?",
                buttons: {
                    cancel: {
                        label: "HỦY"
                    },
                    confirm: {
                        label: "XÓA"
                    }
                },
                callback: function (result) {
                    if(result) {
                        that.deletePromotionList();
                    }
                }
            });

        } else  {
            this.toastr.warning(`Vui lòng chọn Khuyến Mãi cần xóa`);
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

            // Call API remove list promotion selected
            this.promotionService.deletePromotionList(list_id_selected, this.lang).subscribe(
                (data) => {
                    if (data.status == 204) {
                        this.toastr.success(`Xóa ${this.length_selected} Khuyến Mãi thành công`);

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
        Function changeLang(): Change language and callback service getEvents()
        Author: Lam
    */
    changeLang(value){
        if(this.lang !== value){
            $('.custom_table').attr('style', 'height: 640px');
            this.promotion_list = null;
            this.lang = value;
            this.getAllPromotion();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }

    /*
        Function isDisable(): Check promotion not is_draft or end_date < date now to disabled button
        Author: Lam
    */
    isDisable(promotion){
        let date_now = this.datePipe.transform(Date.now(), 'dd/MM/yyy');
        let end_date = promotion.end_date ? promotion.end_date : '';
        if((promotion.is_draft === false || (end_date !== '' && end_date < date_now)) && this.user_current.role !== 1){
            return true;
        }
        return null;
    }

    /*
        Function isDisable(): Check promotion not is_draft or end_date < date now to disabled button
        Author: Lam
    */
    isCheckDisplay(promotion){
        let date_now = this.datePipe.transform(Date.now(), 'dd/MM/yyy');
        let end_date = promotion.end_date ? promotion.end_date : '';
        if((promotion.is_draft === false || (end_date !== '' && end_date < date_now)) && this.user_current.role !== 1){
            return true;
        }
        return false;
    }

    /*
        Function isDisableQRCode(): Check promotion end_date < date now to disabled button
        Author: Lam
    */
    isDisableQRCode(promotion){
        let date_now = this.datePipe.transform(Date.now(), 'dd/MM/yyy');
        let end_date = promotion.end_date ? promotion.end_date : '';
        if((end_date !== '' && end_date < date_now) && this.user_current.role !== 1){
            return true;
        }
        return null;
    }

}
