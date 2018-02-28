import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';

import { Denomination }  from '../../../shared/class/denomination';

import { DenominationService } from '../../../shared/services/denomination.service';

@Component({
    selector: 'app-denomination-list',
    templateUrl: './denomination-list.component.html',
    styleUrls: ['./denomination-list.component.css']
})
export class DenominationListComponent implements OnInit {

    dtOptions: any = {};
    denominations: Denomination[];
    select_checkbox = false; // Default checkbox false
    deno_selected: any;
    selectedAll: any;
    message_success: string = ""; // Display message success
    message_result = ''; // Message result

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    // Using trigger becase fetching the list of denominations can be quite long
    // thus we ensure the data is fetched before rensering
    dtTrigger: Subject<any> = new Subject();

    constructor(
        private denominationService: DenominationService,
        private route: ActivatedRoute
        ) {
        this.denominations = [];
        this.deno_selected = [];
    }

    ngOnInit() {
        this.dtOptions = {
    			// Declare the use of the extension in the dom parameter
                language: {
                    sSearch: '',
                    searchPlaceholder: ' Nhập thông tin tìm kiếm',
                    lengthMenu: 'Hiển thị _MENU_ Mệnh giá nạp tiền',
                    info: "Hiển thị _START_ tới _END_ của _TOTAL_ Mệnh giá nạp tiền",
                    paginate: {
                        "first":      "Đầu",
                        "last":       "Cuối",
                        "next":       "Sau",
                        "previous":   "Trước"
                    },
                    select: {
                        rows: ''
                    },
                    sInfoFiltered: "",
                    zeroRecords: 'Không có mệnh giá nạp tiền nào để hiển thị',
                    infoEmpty: ""
                },
                responsive: true,
                pagingType: "full_numbers",
            };
            this.getAllDenomination();
            this.route.params.subscribe(params => {
                if(params.message_post){
                    this.message_result = " Thêm "+ params.message_post + " thành công.";
                } else {
                    this.message_result = "";
                }
            });
        }
	// Get All Denomination
	getAllDenomination() {
		this.denominationService.getAllDenomination().subscribe(
			result => {
				this.denominations = result;
				this.dtTrigger.next();
			});
	}

	// Checkbox all
	checkAllDeno(event){
        let array_del = [];
        if(event.target.checked){
            this.denominations.forEach(function(element) {
                array_del.push(element.id);
            });
            this.deno_selected = array_del;
            this.select_checkbox = true;
            this.message_success = "";
            this.message_result = "";
        }else{
            this.select_checkbox = false;
            this.denominations.forEach((item, index) => {
                this.deno_selected.splice(index, this.denominations.length);
            });
        }
    }

	// Change checkbox item
	checkItemChange(event, deno) {
		if(event.target.checked){
            this.deno_selected.push(deno.id);
            this.message_success = "";
            this.message_result = "";
        }
        else{
            let updateDenoItem = this.deno_selected.find(this.findIndexToUpdate, deno.id);

            let index = this.deno_selected.indexOf(updateDenoItem);

            this.deno_selected.splice(index, 1);
        }
    }
    findIndexToUpdate(type) { 
        return type.id === this;
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
            result => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    var self = this;
                    this.deno_selected.forEach(function(e){
                        dtInstance.rows('#delete'+e).remove().draw();
                        var deno_item = self.denominations.find(deno => deno.id == e);
                        self.denominations = self.denominations.filter(denominations => denominations !== deno_item);
                    });
                    this.deno_selected = [];
                });
                this.message_success = "Xóa mệnh giá nạp tiền thành công";
            });
    }
}
