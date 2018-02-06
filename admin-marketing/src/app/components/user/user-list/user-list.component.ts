import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../../shared/class/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
	dtOptions: any = {};
	users: User[];
	select_checkbox = false; // Default checkbox false
	user_selected: any;
	message_success: string = ""; // Display message success
  	message_error: string = ""; // Display message error
  	message_result = ''; // Message result

 	// Inject the DataTableDirective into the dtElement property
  	@ViewChild(DataTableDirective)
  	dtElement: DataTableDirective;

	// Using trigger becase fetching the list of feedbacks can be quite long
  	// thus we ensure the data is fetched before rensering
	// dtTrigger: Subject<any> = new Subject();
  	constructor(
  		private route: ActivatedRoute
  		) {
  			this.users = [];
  			this.user_selected = [];
  		 }

  	ngOnInit() {
  		this.dtOptions = {
  			// Declare the use of the extension in the dom parameter
	        language: {
	        	sSearch: '',
	        	searchPlaceholder: ' Nhập thông tin tìm kiếm',
	        	lengthMenu: 'Hiển thị _MENU_ user',
	        	info: "Hiển thị _START_ tới _END_ của _TOTAL_ user",
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
		    	zeroRecords: 'Không có user nào để hiển thị',
		    	infoEmpty: ""
	        },
	        responsive: true,
	        pagingType: "full_numbers",
	        select: {
	          	style: 'multi',
            	selector: 'td:first-child'
	          },
	  	};
	  	this.getAllUser()
  	}

  	// Get All User
  	getAllUser() {

  	}

  	// Checkbox all
  	checkAllUser(event){
        let array_del = [];
        if(event.target.checked){
            this.users.forEach(function(element) {
                array_del.push(element.id);
            });
            this.user_selected = array_del;
            this.select_checkbox = true;
            this.message_error = "";
            this.message_result = "";
        }else{
            this.select_checkbox = false;
            this.users.forEach((item, index) => {
        		this.user_selected.splice(index, this.users.length);
     		});
        }
    }

  	// Change checkbox item
  	checkItemChange(event, deno) {
  		if(event.target.checked){
        	this.user_selected.push(deno.id);
          this.message_error = "";
          this.message_result = "";
      	}
      	else{
       		let updateDenoItem = this.user_selected.find(this.findIndexToUpdate, deno.id);

       		let index = this.user_selected.indexOf(updateDenoItem);

       		this.user_selected.splice(index, 1);
      	}
  	}
  	findIndexToUpdate(type) { 
        return type.id === this;
    }

    // Delete All Checkbox
    deleteUsersCheckbox() {
    	
    }

}
