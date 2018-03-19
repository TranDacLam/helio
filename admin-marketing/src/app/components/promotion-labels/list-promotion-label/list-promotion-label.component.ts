import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionLabel } from '../../../shared/class/promotion-label';
import { PromotionLabelService } from '../../../shared/services/promotion-label.service';
import { message } from '../../../shared/utils/message';
import 'rxjs/add/observable/throw';
import * as datatable_config from '../../../shared/commons/datatable_config';

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

    message_result = ''; // Message error
    errorMessage = '';

    lang: string = 'vi';

    constructor(private promotionLabelService: PromotionLabelService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.dtOptions = datatable_config.data_config('Nhãn Khuyến Mãi');
        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
            },
            columnDefs: [
                {
                    targets: 1,
                    visible: false
                },
                { 
                    orderable: false, 
                    targets: 0 
                }
            ]
        };
        this.dtOptions = {...this.dtOptions, ...dt_options_custom };

        this.getPromotionLabels();

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
                this.message_result = 'Xóa nhãn khuyến mãi thành công.';
            }
        });
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
                if(error.code === 403){
                    this.errorMessage = error.message;
                    this.message_result = '';
                }else{
                    this.router.navigate(['/error', { message: error.message}]);
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
        Function deletePormotionLabelEvent(): confirm delete
        @author: Lam
    */
    deletePormotionLabelEvent(){
        let that = this;
        if ( this.length_selected > 0 ) {
            bootbox.confirm({
                title: "Bạn có chắc chắn",
                message: "Bạn muốn xóa " + this.length_selected + " nhãn khuyến mãi đã chọn",
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
                        that.onDeletePromotionLabel();
                    }
                }
            });

        } else  {
            bootbox.alert("Vui lòng chọn nhãn khuyến mãi cần xóa");
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
                        this.message_result = "Xóa "+ this.length_selected + " nhãn khuyến mãi thành công"

                        // Remove all promotion selected on UI
                        dtInstance.rows('.selected').remove().draw();
                        // Reset count promotion
                        this.length_all =  dtInstance.rows().count();
                        this.length_selected = 0;
                        this.errorMessage = '';
                    } else {
                        this.router.navigate(['/error', { message: error.message}]);
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
            this.promotion_labels = null;
            this.lang = 'vi';
            this.getPromotionLabels();
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
            this.promotion_labels = null;
            this.lang = 'en';
            this.getPromotionLabels();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }

}
