import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs/Subject';

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
	message_success: string = ""; // Display message success
  message_error: string = ""; // Display message error

	// Using trigger becase fetching the list of feedbacks can be quite long
    // thus we ensure the data is fetched before rensering
	dtTrigger: Subject<any> = new Subject();

  	constructor(private denominationService: DenominationService) {
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
	        select: {
	          	style: 'multi',
            	selector: 'td:first-child'
	          },
	  	};
	  	this.getAllDenomination();
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
            this.message_error = "";
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
          this.message_error = ""
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
  	// Delete All select checkbox
  	deleteDenominationCheckbox() {
  		if( this.deno_selected.length == 0) {
        this.message_error = "Vui lòng chọn quảng cáo để xóa";
      } else {
        this.denominationService.deleteAllDenosSelected(this.deno_selected).subscribe(
        result => {
             for(let i=0; i < this.deno_selected.length; i++){
               if(this.denominations.find(x => x=this.deno_selected[i]))
               {
                 this.denominations.splice(this.denominations.indexOf(this.deno_selected[i]), 1);
               }
             }
             this.message_success = "Xóa quảng cáo thành công";
           });
      }
  	}
}
