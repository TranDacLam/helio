import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../../shared/class/user';
import { data_config } from '../../../shared/commons/datatable_config';

declare var bootbox:any;

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
        // Call data_config
  		this.dtOptions = data_config.dtOptions;
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
            this.message_success = "";
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
          this.message_success = "";
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

    /*
        Confirm Delete Checkbox Selected
        Using bootbox plugin
        @author: Trangle
     */
    confirmDelete() {
        /* Check user_selected not null and length >0
            True: Show confirm and call function deleteFeedbackCheckbox 
            False: show alert
        */
        if(this.user_selected !== null && this.user_selected.length > 0 ){
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.user_selected.length + " phần tử đã chọn",
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
                        this.deleteUsersCheckbox()
                    }
                }
            });
        } else {
            bootbox.alert("Vui lòng chọn user để xóa");
        } 
    }

    // Delete All Checkbox
    deleteUsersCheckbox() {
    	
    }

}
