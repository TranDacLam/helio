import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';

import { HotAdvs } from '../../../shared/class/hot-advs';

@Component({
  selector: 'app-hot-advs-list',
  templateUrl: './hot-advs-list.component.html',
  styleUrls: ['./hot-advs-list.component.css']
})
export class HotAdvsListComponent implements OnInit {

	dtOptions: any = {};
	select_checkbox = false; // Default checkbox false
	hot_adv_selected: any;
	hot_advs : HotAdvs [];
	message_success: string = ""; // Display message success
  	message_error: string = ""; // Display message error
  	message_result = ''; // Message result

  	// Inject the DataTableDirective into the dtElement property
  	@ViewChild(DataTableDirective)
  	dtElement: DataTableDirective;

	// Using trigger becase fetching the list of feedbacks can be quite long
  	// thus we ensure the data is fetched before rensering
	dtTrigger: Subject<any> = new Subject();

  	constructor(
  		private route: ActivatedRoute
  		) {
  			this.hot_advs = [];
  			this.hot_adv_selected = [];
  		}

  	ngOnInit() {
  		this.dtOptions = {
  			// Declare the use of the extension in the dom parameter
	        language: {
	        	sSearch: '',
	        	searchPlaceholder: ' Nhập thông tin tìm kiếm',
	        	lengthMenu: 'Hiển thị _MENU_ Hot Advs',
	        	info: "Hiển thị _START_ tới _END_ của _TOTAL_ Hot Advs",
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
		    	zeroRecords: 'Không có Hot Advs nào để hiển thị',
		    	infoEmpty: ""
	        },
	        responsive: true,
	        pagingType: "full_numbers",
	  	};
	  	this.getAllHotAdvs();
  	}

  	getAllHotAdvs() {

  	}
  	// Checkbox all
  	checkAllHotAdvs(event){
        let array_del = [];
        if(event.target.checked){
            this.hot_advs.forEach(function(element) {
                array_del.push(element.id);
            });
            this.hot_adv_selected = array_del;
            this.select_checkbox = true;
            this.message_error = "";
            this.message_result = "";
        }else{
            this.select_checkbox = false;
            this.hot_advs.forEach((item, index) => {
        		this.hot_adv_selected.splice(index, this.hot_advs.length);
     		});
        }
    }

  	// Change checkbox item
  	checkItemChange(event, deno) {
  		if(event.target.checked){
        	this.hot_adv_selected.push(deno.id);
          this.message_error = "";
          this.message_result = "";
      	}
      	else{
       		let updateDenoItem = this.hot_adv_selected.find(this.findIndexToUpdate, deno.id);

       		let index = this.hot_adv_selected.indexOf(updateDenoItem);

       		this.hot_adv_selected.splice(index, 1);
      	}
  	}
  	findIndexToUpdate(type) { 
        return type.id === this;
    }

    deleteHotAdvsCheckbox() {

    }

}
