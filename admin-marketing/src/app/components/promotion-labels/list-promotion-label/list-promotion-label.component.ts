import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { PromotionLabel } from '../../../shared/class/promotion-label';
import { PromotionLabelService } from '../../../shared/services/promotion-label.service';
import { message } from '../../../shared/utils/message';
import 'rxjs/add/observable/throw';

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

    promotion_labels: PromotionLabel[];
    promotion_labels_del = []; // Get array id to delete all id promotion label
    length_promotion_labels: number;
    select_checked = false; // Check/uncheck all Promotion Label
    message_result = ''; // Message error
    errorMessage = '';

    constructor(private promotionLabelService: PromotionLabelService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.getPromotionLabels();

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
        Function getPromotionLabels(): Callback service function getPromotionLabels() get all Promotion Label
        Author: Lam
    */
    getPromotionLabels(){
        this.promotionLabelService.getPromotionLabels().subscribe(
            (data) => {
                this.promotion_labels = data;
                this.length_promotion_labels = this.promotion_labels.length;
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
        Function onSelectCKB(): checked/uncheck add/delete id to array promotion_labels_del
        Author: Lam
    */
    onSelectCKB(event, value){
        if(event.target.checked){
            this.promotion_labels_del.push(value.id);
        }else{
            this.promotion_labels_del = this.promotion_labels_del.filter(k => k !== value.id);
        }
    }

    /*
        Function onSelectAll(): checked/uncheck add/delete all id Promotion Label to array promotion_labels_del
        Author: Lam
    */
    onSelectAll(event){
        this.promotion_labels_del = [];
        let array_del = [];
        if(event.target.checked){
            this.promotion_labels.forEach(function(element) {
                array_del.push(element.id);
            });
            this.promotion_labels_del = array_del;
            this.select_checked = true;
        }else{
            this.select_checked = false;
        }
    }

    /*
        Function deletePormotionLabelEvent(): confirm delete
        @author: Lam
    */
    deletePormotionLabelEvent(){
        let that = this;
        if ( this.promotion_labels_del.length > 0 ) {
            bootbox.confirm({
                title: "Bạn có chắc chắn",
                message: "Bạn muốn xóa " + this.promotion_labels_del.length + " phần tử đã chọn",
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
            bootbox.alert("Vui lòng chọn phần tử cần xóa");
        }
        
    }

    /*
        Function onDeletePromotionLabel(): 
         + Callback service function onDelPromotionLabelSelect() delete Promotion Label by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDeletePromotionLabel(){
        this.promotionLabelService.onDelPromotionLabelSelect(this.promotion_labels_del).subscribe(
            (data) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    this.promotion_labels_del.forEach(function(element) {
                        dtInstance.rows('#del-'+element).remove().draw();
                    });
                    this.length_promotion_labels = this.length_promotion_labels - this.promotion_labels_del.length;
                    this.promotion_labels_del = [];
                });
                this.select_checked = false;
                this.message_result = 'Xóa thành công.';
            }
        );
    }

}
