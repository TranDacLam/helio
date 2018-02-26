import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { PromotionLabel } from '../../../shared/class/promotion-label';
import { PromotionLabelService } from '../../../shared/services/promotion-label.service';
import { message } from '../../../shared/utils/message';
import 'rxjs/add/observable/throw';


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
    select_checked = false; // Check/uncheck all Promotion Label
    message_result = ''; // Message error

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
                });
            }
        );
    }

}