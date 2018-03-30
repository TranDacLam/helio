import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

    length_all: Number = 0;
    length_selected: Number = 0;

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
        private toastr: ToastrService,
  		) {
  			this.users = [];
  		}

  	ngOnInit() {
        // Call data_config
  		this.dtOptions = data_config(this.record);
        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
            },
            columnDefs: [
                {
                    targets: 1,
                    visible: false
                },
                { 
                    orderable: false, 
                    targets: 0 
                },
            ]
        };
        this.dtOptions = {...this.dtOptions, ...dt_options_custom };
        // Get All User
	  	this.getAllUser();
  	}

  	/* 
        Get All User
        @author: Trangle
    */
  	getAllUser() {
        this.userService.getAllUsers().subscribe(
            (data) => {
                this.users = data;
                this.length_all = this.users.length;
                this.dtTrigger.next();
            },
            (error) => {
                this.router.navigate(['/error', { message: error.json().message }])
            }
        )
  	}

  	/*
        Event select checbox on row
            Case1: all row are checked then checkbox all on header is checked
            Case1: any row is not checked then checkbox all on header is not checked
        @author: Lam 
    */
    selectCheckbox(event) {   
        $(event.target).closest( "tr" ).toggleClass( "selected" );
        this.getLengthSelected();
        this.checkSelectAllCheckbox();
    }

    // input checkall checked/unchecked
    checkSelectAllCheckbox() {
        if($('#table_id tbody tr').hasClass('selected')){
            $('#select-all').prop('checked', $("#table_id tr.row-data:not(.selected)").length == 0);
        }else{
            $('#select-all').prop('checked', false);
        }
        this.getLengthSelected();
    }
    /*
        Event select All Button on header table
        @author: Lam 
    */
    selectAllEvent(event) {
        if( event.target.checked ) {
            $("#table_id tr").addClass('selected');
        } else {
            $("#table_id tr").removeClass('selected');
        }
        $("#table_id tr input:checkbox").prop('checked', event.target.checked);
        this.getLengthSelected();
    }

    /*
        Function getLengthSelected(): draw length selected
        @author: Lam
    */
    getLengthSelected(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            this.length_selected = dtInstance.rows('.selected').count();
        })
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
        if(this.length_selected> 0 ){
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.length_selected + " User đã chọn?",
                buttons: {
                    cancel: {
                        label: "HỦY"
                    },
                    confirm: {
                        label: "XÓA"
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
            this.toastr.warning(`Vui lòng chọn User cần xóa`);
        } 
    }

    // Delete All Checkbox
    deleteUsersCheckbox() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list promotion id selected
            let get_list_id = dtInstance.cells('.selected', 1).data().toArray();
            // array string to array number
            let list_id_selected = get_list_id.map(Number);

            // Call API remove list promotion selected
            this.userService.deleteUserSelected(list_id_selected).subscribe(
                (data) => {
                    this.toastr.success(`Xóa ${this.length_selected} User thành công`);

                    // Remove all promotion selected on UI
                    dtInstance.rows('.selected').remove().draw();
                    // Reset count promotion
                    this.length_all =  dtInstance.rows().count();
                    this.length_selected = 0;
                },
                (error) => {   
                    if(error.json().code == 405) {
                        this.toastr.error(`${error.json().message}`);
                    } else {
                        this.router.navigate(['/error', { message: error.json().message }]);
                    }
                });
            });
    	
    }

}
