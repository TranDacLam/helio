import { Component, OnInit, ViewChild, QueryList } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { PromotionService } from '../../../shared/services/promotion.service';
import { Promotion } from '../../../shared/class/promotion';
import { datatable_config } from '../../../shared/commons/datatable_config';

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

	promotion_list: Promotion[] = [];


    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    length_all: Number = 0;
    length_selected: Number = 0;

    message_result: string = "";

    api_domain:string = "";

    /*
        Using trigger becase fetching the list of feedbacks can be quite long
        thus we ensure the data is fetched before rensering
    */ 
    dtTrigger: Subject<any> = new Subject();

    constructor(
        private promotionService: PromotionService,
        private router: Router,
        private route: ActivatedRoute
        ) { }

    ngOnInit() {
        this.api_domain = env.api_domain_root;
    	this.getAllPromotion();
    	this.dtOptions = datatable_config.dtOptions;

        this.route.params.subscribe(params => {
            if (params && params.action) {
                this.message_result = params.action + params.promotion_name + '" thành công.';
            }
        });
        
    }

    /*
        Call Service get all promotion
        @author: diemnguyen 
    */
    getAllPromotion() {
        this.promotionService.getAllPromotion().subscribe(
            (data) => {
                this.promotion_list = data;
                this.length_all = data.length;
                this.dtTrigger.next();
            }, 
            (error) => {
                this.router.navigate(['/error']);
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
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            this.length_selected = dtInstance.rows('.selected').count();
            // Any row not selected then checked all button is not checked
            $('#select-all').prop('checked', this.length_selected == this.length_all);
        });
    }

    /*
        Event select All Button on header table
        @author: diemnguyen 
    */
    selectAllEvent(event) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows().every( function () {
                let row = this.node();
                if( event.target.checked ) {
                    $(row).addClass('selected');
                } else {
                    $(row).removeClass('selected');
                }
                $(row).find('input:checkbox').prop('checked', event.target.checked);
            });
            this.length_selected = dtInstance.rows('.selected').count();
        });
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
                message: "Bạn muốn xóa " + this.length_selected + " phần tử đã chọn",
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
            bootbox.alert("Vui lòng chọn phần tử cần xóa");
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
            this.promotionService.deletePromotionList(list_id_selected).subscribe(
                (data) => {
                    if (data.status == 204) {
                        this.message_result = "Xóa "+ this.length_selected + " phần tử thành công"

                        // Remove all promotion selected on UI
                        dtInstance.rows('.selected').remove().draw();
                        // Reset count promotion
                        this.length_all =  dtInstance.rows().count();
                        this.length_selected = 0;
                    } else {
                        this.router.navigate(['/error']);
                    }
                }, 
                (error) => {
                    this.router.navigate(['/error']);
                });
        });
    }


}
