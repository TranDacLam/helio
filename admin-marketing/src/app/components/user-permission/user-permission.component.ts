import { Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { User } from '../../shared/class/user';
import { Role } from '../../shared/class/role';
import { UserPermissionService } from '../../shared/services/user-permission.service';
import { Location } from '@angular/common';
import 'rxjs/add/observable/throw';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'app-user-permission',
    templateUrl: './user-permission.component.html',
    styleUrls: ['./user-permission.component.css'],
})
export class UserPermissionComponent implements OnInit {

    constructor(private userPermissionService: UserPermissionService, private router: Router) { }

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
                // console.log(data);
                // reload datatable
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
                this.roles = data;
                if (data.length > 0) {
                    this.getUserListByRole(data[0].id);
                }
            },
            error => {
                this.router.navigate(['/error', { message: error.json().message }]);
            }
        )
    }
    
    ngOnInit() {
        this.getRoles();
    }

}
