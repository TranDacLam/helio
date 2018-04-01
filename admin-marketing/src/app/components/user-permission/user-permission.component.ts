import { Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { User } from '../../shared/class/user';
import { Role } from '../../shared/class/role';
import { UserPermissionService } from '../../shared/services/user-permission.service';
import { Location } from '@angular/common';
import 'rxjs/add/observable/throw';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


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

    /*
        Event get User in table right
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

    setRoleForUser(list_id) {
        let role_id = $('.role_checkbox:checked').val();
        this.userPermissionService.setRoleForUser(list_id, role_id).subscribe(
            data => {
                this.toastr.success(`Lưu thành công.`);
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

    ngOnInit() {
        this.getRoles();
    }

}
