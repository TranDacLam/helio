import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../../shared/class/user';
import { UserService } from '../../../shared/services/user.service';
import { data_config } from '../../../shared/commons/datatable_config';

declare var bootbox:any;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [ UserService ]
})
export class UserListComponent implements OnInit {

	dtOptions: any = {};

	users: User[];

	user_selected: any;

  	message_result: string = ''; // Message result
    record: string = "User";

 	// Inject the DataTableDirective into the dtElement property
  	@ViewChild(DataTableDirective)
  	dtElement: DataTableDirective;

	/* 
        Using trigger becase fetching the list of feedbacks can be quite long
  	    thus we ensure the data is fetched before rensering
    */
	dtTrigger: Subject<any> = new Subject();

  	constructor(
  		private route: ActivatedRoute,
        private userService: UserService,
        private router: Router,

  		) {
  			this.users = [];
  			this.user_selected = [];
  		 }

  	ngOnInit() {
        // Call data_config
  		this.dtOptions = data_config(this.record).dtOptions;

        // Get All User
	  	this.getAllUser();

        this.route.params.subscribe(params => {
            if( params.message_post ){
                this.message_result = " Thêm "+ params.message_post + " thành công.";
            } else if ( params.message_put ) {
                this.message_result = "  Chỉnh sửa "+ params.message_put + " thành công.";
            } else if( params.message_del ) {
                this.message_result = " Xóa " + params.message_del + " thành công.";
            } else {
                this.message_result = "";
            }
        });
  	}

  	/* 
        Get All User
        @author: Trangle
    */
  	getAllUser() {
        this.userService.getAllUsers().subscribe(
            (data) => {
                this.users = data;
                this.dtTrigger.next();
            },
            (error) => {
                this.router.navigate(['/error', { message: error.json().message }])
            }
        )
  	}

  	/* 
        Checkbox all User
        Step1: Create array to contain id user to checked
        Step 2: Check checkbox all user checked
            True: Push id checked to array_del, assign user_selected = array_del, message_result = ''
            False: Splice all id from array
        @author: Trangle
    */
     
  	checkAllUser(event){
        let array_del = [];
        if(event.target.checked){
            this.users.forEach(function(element) {
                array_del.push(element.id);
                $('#check_'+element.id).prop('checked', true);
            });
            this.user_selected = array_del;
            this.message_result = "";
        }else{
            this.users.forEach((item, index) => {
                $('#check_'+item.id).prop('checked', false);
        		this.user_selected.splice(index, this.users.length);
     		});
        }
    }

  	/* 
        Change checkbox item
        Step : Checking checkbox item to checked
            True: Push id to user_selected, message_result = '', 
                check length.user_selected = users.length, checkbox all = true
            False: remove id from user_selected, check all = false
        @author: Trangle
    */
  	checkItemChange(event, user) {
  		if(event.target.checked){
            this.user_selected.push(user.id);
            if (this.user_selected.length === this.users.length) {
                $('#allCheck').prop('checked', true);
            }
            this.message_result = "";
      	}
      	else{
            var index = this.user_selected.indexOf(user);
            this.user_selected.splice(index, 1);

            // uncheck selectAll
            let selectAll = $('#allCheck').prop('checked', false);
      	}
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
        this.userService.deleteUserSelected(this.user_selected).subscribe(
            (data) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    var self = this;
                    this.user_selected.forEach(function(e){
                        dtInstance.rows('#delete'+e).remove().draw();
                        var item = self.users.find(user => user.id == e);
                        self.users = self.users.filter(users => users !== item);
                    });
                    this.user_selected = [];
                });
                this.message_result = "Xóa user thành công";
            },
            (error) => {
                this.router.navigate(['/error', { message: error.json().message + error.json().fields }])
            }
        )
    	
    }

}
