import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { User } from '../../shared/class/user';
import { Role } from '../../shared/class/role';
import { UserPermissionService } from '../../shared/services/user-permission.service';
import { Location } from '@angular/common';
import 'rxjs/add/observable/throw';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserMultiselectComponent } from '../user-multiselect/user-multiselect.component';



@Component({
    selector: 'app-user-permission',
    templateUrl: './user-permission.component.html',
    styleUrls: ['./user-permission.component.css'],
})
export class UserPermissionComponent implements OnInit {

    constructor(
        private userPermissionService: UserPermissionService,
        private toastr: ToastrService,
        private router: Router) { }

    user_list_left: User[];
    user_list_right: User[];
    roles: Role[];
    @ViewChild(UserMultiselectComponent)
    userMultiselect: UserMultiselectComponent

    /*
        Event get User in datatable
        @author: hoangnguyen 
    */
    getUserListByRole(id: number) {
        this.user_list_right = null;
        this.user_list_left = null;
        this.userPermissionService.getUserListByRole(id).subscribe(
            data => {
                this.user_list_right = data.users_selected;
                this.user_list_left = data.users_all;
            },
            error => {
                this.router.navigate(['/error', { message: error.json().message }]);
            }
        )
    }

    /*
        Event get Role in above table
        @author: hoangnguyen 
    */
    getRoles() {
        this.userPermissionService.getRoles().subscribe(
            data => {
                this.setOptionDatatable();
                if (data.length > 0) {
                    this.roles = data;
                    this.getUserListByRole(data[0].id);
                }
            },
            error => {
                this.router.navigate(['/error', { message: error.json().message }]);
            }
        )
    }
    /*
        set role for user in table right
        @author: hoangnguyen 
    */
    setRoleForUser(list_id) {
        let role_id = $('.role_checkbox:checked').val();
        this.userPermissionService.setRoleForUser(list_id, role_id).subscribe(
            data => {
                this.toastr.success(`Thay đổi danh sách thành công.`);
            },
            error => {
                if (error.status == 400) {
                    this.toastr.error(`${error.json().message}`);
                } else {
                    this.router.navigate(['/error', { message: error.json().message }]);
                }

            }
        )
    }
    /*
        set option for datatable in user permission
        @author: hoangnguyen 
    */
    setOptionDatatable(){
        let column_0= {
            orderable: false,
            width: 20,
            className: "dt-center",
            targets: 0
        };
        let column_2= {
            orderable: true,
            width: 120,
            targets: 2
        };
        let column_3 = { targets: 3,visible: false};
        let column_5 = { targets: 5,visible: false};
        let column_6 = { targets: 6,visible: false};
        this.userMultiselect.dtOptions_right.columnDefs.push(column_0, column_2, column_3, column_5, column_6);
        this.userMultiselect.dtOptions_left.columnDefs.push(column_0, column_2,column_3, column_5, column_6);
        this.userMultiselect.dtOptions_right.scrollX = false;
        this.userMultiselect.dtOptions_left.scrollX = false;
    }

    ngOnInit() {
        this.getRoles();
    }

}
