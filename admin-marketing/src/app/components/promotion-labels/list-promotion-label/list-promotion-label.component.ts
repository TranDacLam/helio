import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { PromotionLabel } from '../../../shared/class/promotion-label';
import { PromotionLabelService } from '../../../shared/services/promotion-label.service';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/observable/throw';
import * as datatable_config from '../../../shared/commons/datatable_config';
import { CustomizeDataTable } from './../../../shared/commons/customize_datatable';

declare var bootbox:any;

@Component({
    selector: 'app-list-promotion-label',
    templateUrl: './list-promotion-label.component.html',
    styleUrls: ['./list-promotion-label.component.css'],
    providers: [PromotionLabelService]
})
export class ListPromotionLabelComponent implements OnInit {

    /*
        Author: Lam
    */

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: any = {};

    length_all: Number = 0;
    length_selected: Number = 0;

    promotion_labels: PromotionLabel[];

    lang: string = 'vi';

    constructor(
        private promotionLabelService: PromotionLabelService,  
        private router: Router,
        private toastr: ToastrService,
        private customizeDatatable: CustomizeDataTable,
    ) { }

    ngOnInit() {
        this.dtOptions = datatable_config.data_config('Nhãn Khuyến Mãi');
        // custom datatable option
        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
                this.customizeDatatable.dataTableSorting();
            },
            columnDefs: [
                {
                    targets: 1,
                    visible: false,
                    searchable: false,
                },
                { 
                    orderable: false, 
                    targets: 0 
                }
            ],

        };
        // create new object from 2 object use operator spread es6
        this.dtOptions = {...this.dtOptions, ...dt_options_custom };

        this.getPromotionLabels();

    }

    /*
        Function getPromotionLabels(): Callback service function getPromotionLabels() get all Promotion Label
        Author: Lam
    */
    getPromotionLabels(){
        this.promotionLabelService.getPromotionLabels(this.lang).subscribe(
            (data) => {
                this.promotion_labels = data;
                this.length_all = this.promotion_labels.length;
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
        Function deletePormotionLabelEvent(): confirm delete
        @author: Lam
    */
    deletePormotionLabelEvent(){
        let that = this;
        if ( this.length_selected > 0 ) {
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.length_selected + " Nhãn Khuyến Mãi đã chọn?",
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
                        that.onDeletePromotionLabel();
                    }
                }
            });

        } else  {
            this.toastr.warning(`Vui lòng chọn Nhãn Khuyến Mãi cần xóa`);
        }
        
    }

    /*
        Function onDeletePromotionLabel(): 
         + Callback service function onDelPromotionLabelSelect() delete Promotion Label by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDeletePromotionLabel(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list promotion id selected
            let get_list_id = dtInstance.cells('.selected', 1).data().toArray();
            // array string to array number
            let list_id_selected = get_list_id.map(Number);

            // Call API remove list promotion selected
            this.promotionLabelService.onDelPromotionLabelSelect(list_id_selected, this.lang).subscribe(
                (data) => {
                    if (data.code === 204) {
                        this.toastr.success(`Xóa ${this.length_selected} Nhãn Khuyến Mãi thành công`);

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
            this.promotion_labels = null;
            this.lang = value;
            this.getPromotionLabels();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }

    
}
