import { Component, OnInit, ViewChild, QueryList } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import 'rxjs/add/operator/map';


import { PromotionService } from '../../../shared/services/promotion.service';
import { Promotion } from '../../../shared/class/promotion';
import { datatable_config } from '../../../shared/commons/datatable_config';


@Component({
    selector: 'app-promotions',
    templateUrl: './promotions.component.html',
    styleUrls: ['./promotions.component.css']
})

/*
    PromotionsComponent
    @author: diemnguyen 
*/ 
export class PromotionsComponent implements OnInit {
	dtOptions: any = {};

	promotion_list: Promotion[] = [];

	dtTrigger: Subject<any> = new Subject();

    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    constructor(private promotionService: PromotionService) { }

    ngOnInit() {
    	this.getAllPromotion();

    	this.dtOptions = datatable_config.dtOptions;
    }
    /*
        Call Service get all promotion
        @author: diemnguyen 
    */
    getAllPromotion() {
        this.promotionService.getAllPromotion().subscribe(promotions => {
            this.promotion_list = promotions;
            this.dtTrigger.next();
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
            // Any row not selected then checked all button is not checked
            $('#select-all').prop('checked', dtInstance.rows('tr:not(.selected)').count() < 1);
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
        });
    }

}


    
