import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router } from '@angular/router';

import { Denomination }  from '../../../shared/class/denomination';

import { DenominationService } from '../../../shared/services/denomination.service';
import { data_config } from '../../../shared/commons/datatable_config';

declare var bootbox:any;

@Component({
    selector: 'app-denomination-list',
    templateUrl: './denomination-list.component.html',
    styleUrls: ['./denomination-list.component.css']
})
export class DenominationListComponent implements OnInit {

    dtOptions: any = {};
    denominations: Denomination[];

    deno_selected: any;
    selectedAll: any;
    checkbox:boolean= false;

    message_result = ''; // Message result
    record: string = "Mệnh Giá Nạp Tiền";

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    // Using trigger becase fetching the list of denominations can be quite long
    // thus we ensure the data is fetched before rensering
    dtTrigger: Subject<any> = new Subject();

    constructor(
        private denominationService: DenominationService,
        private route: ActivatedRoute,
        private router: Router,
        ) {
        this.denominations = [];
        this.deno_selected = [];
    }

    ngOnInit() {
        // Call data_config 
        this.dtOptions = data_config(this.record).dtOptions;
        this.getAllDenomination();
        this.route.params.subscribe(params => {
            if(params.message_post){
                this.message_result = " Thêm "+ params.message_post + " thành công.";
            } else {
                this.message_result = "";
            }
        });
    }
	/* 
        Get All Denomination
        Call service Denomination
        @author: Trangle
    */
	getAllDenomination() {
		this.denominationService.getAllDenomination().subscribe(
			(result) => {
				this.denominations = result;
				this.dtTrigger.next();
			},
            (error) => {
                this.router.navigate(['/error', { message: error }]);
            }
        );
	}
	/*
        Check all denomination selected
        Step: Create array to save id checked
            Checking all checked
            True: push id to array, item checkbox = True, message_result = ''
            False: Remove all id from deno_selected, item checkbox = False
        @author: TrangLe 
     */
	checkAllDeno(event){
        let array_del = [];
        if(event.target.checked){
            this.denominations.forEach(function(element) {
                array_del.push(element.id);
            });
            this.checkbox = true;
            this.deno_selected = array_del;
            this.message_result = "";
        }else{
            this.checkbox = false;
            this.denominations.forEach((item, index) => {
                this.deno_selected.splice(index, this.denominations.length);
            });
        }
    }

	/*
        Check each item selected
        Check item checkbox is checked
            True: push id in array, if deno_selected.lenght = denominations.length -> all checkbox = true
            False: remove id in array, all checkbox = false 
        @author: Trangle 
     */
	checkItemChange(event, deno) {
		if(event.target.checked){
            this.deno_selected.push(deno.id);
            if(this.deno_selected.length == this.denominations.length) {
                $('#allCheck').prop('checked', true);
            }
            this.message_result = "";
        }
        else{

            let index = this.deno_selected.indexOf(deno.id);
            this.deno_selected.splice(index, 1);

            $('#allCheck').prop('checked', false);
        }
    }
    
    confirmDelete() {
        /* Check deno_selected not null and length >0
            True: Show confirm and call function deleteFeedbackCheckbox 
            False: show alert
        */
        if(this.deno_selected !== null && this.deno_selected.length > 0 ){
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.deno_selected.length + " phần tử đã chọn",
                buttons: {
                    confirm: {
                        label: 'Xóa',
                        className: 'btn-success',
                    },
                    cancel: {
                        label: 'Hủy',
                        className: 'pull-left btn-danger',
                    }
                },
                callback: (result)=> {
                    if(result) {
                        // Check result = true. call function
                        this.deleteDenominationCheckbox()
                    }
                }
            });
        } else {
            bootbox.alert("Vui lòng chọn mệnh giá nạp tiền để xóa");
        } 
    }
	// Delete All select checkbox
	deleteDenominationCheckbox() {
        this.denominationService.deleteAllDenosSelected(this.deno_selected).subscribe(
            (result) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    var self = this;
                    this.deno_selected.forEach(function(e){
                        dtInstance.rows('#delete'+e).remove().draw();
                        var deno_item = self.denominations.find(deno => deno.id == e);
                        self.denominations = self.denominations.filter(denominations => denominations !== deno_item);
                    });
                    this.deno_selected = [];
                });
                this.message_result = "Xóa mệnh giá nạp tiền thành công";
            },
            (error) => {
                this.router.navigate(['/error', { message: error.json().message }]);
            }
            );
    }
}
