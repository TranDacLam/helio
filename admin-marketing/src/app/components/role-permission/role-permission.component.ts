import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from './../../shared/class/role';
import { RolePermissionService } from './../../shared/services/role-permission.service';
import { ToastrService } from 'ngx-toastr';
import { ScrollTop } from './../../shared/commons/scroll-top';


@Component({
    selector: 'app-role-permission',
    templateUrl: './role-permission.component.html',
    styleUrls: ['./role-permission.component.css'],
    providers: [RolePermissionService]
})
export class RolePermissionComponent implements OnInit {

    roles: Role[];
    models = [];
    list_role_permission = [];

    constructor(
        private router: Router,
        private rolePermissionService: RolePermissionService,
        private toastr: ToastrService,
        private scrollTop: ScrollTop
    ) { }

    ngOnInit() {
        this.getRole();
    }

    /*
        Function getRolePermission(): call service function getRolePermission() get all models
        Author: Lam
    */
    getRolePermission(){
        this.rolePermissionService.getRolePermission().subscribe(
            (data) => {
                this.models = data;
                setTimeout(() => {
                    this.initCheckedRolePermission();
                }, 1000);

            },
            (error) => {
                this.router.navigate(['/error', { message: error.message }])
            }
        );
    }

    /*
        Function getRole(): call service function getRole() get all Roles
        Author: Lam
    */
    getRole(){
        this.rolePermissionService.getRole().subscribe(
            (data) => {
                this.roles = data;
                this.getRolePermission();
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message }])
            }
        );
    }

    /*
        Function changePermission()
         + Step 1: Get class and id of every input
         + Step 2: checked, unchecked input have .class, checked #id, find index and set/push data
         + Step 3: unchecked, remove object
        Author: Lam
    */
    changePermission(event, model, role, permission){
        let getClass = `permission-${model.id}-${role.id}`;
        let getid = `${permission}-${model.id}-${role.id}`;
        if(event.target.checked){
            $('.'+getClass).not('#'+getid).prop('checked', false);
            let index = this.list_role_permission.findIndex(item => (item.key_model === model.key && item.role === role.id));
            if(index !== -1){
                this.list_role_permission[index].permission = permission;
            }else{
                this.list_role_permission.push({key_model: model.key, role: role.id, permission: permission});
            }
        }else{
            $('#'+getid).prop('checked', false);
            this.list_role_permission = this.list_role_permission.filter(
                item => !(item.role === role.id && item.key_model === model.key)
            );
        }
    }

    /*
        Function initCheckedRolePermission(): init, get all permission role and set checked for input
        Author: Lam
    */
    initCheckedRolePermission(){
        this.models.map(model => {
            model.permission.full.map(item => {
                $('#full-'+model.id+'-'+item.id).prop('checked', true);
            });
            model.permission.change.map(item => {
                $('#change-'+model.id+'-'+item.id).prop('checked', true);
            });
            model.permission.read.map(item => {
                $('#read-'+model.id+'-'+item.id).prop('checked', true);
            });
        });
    }

    /*
        Function onSubmit(): call service saveRolePermission() create and update data
        Author: Lam
    */
    onSubmit(){
        this.rolePermissionService.saveRolePermission(this.list_role_permission).subscribe(
            (data) => {
                this.toastr.success("Lưu thành công");
                this.list_role_permission = [];
                this.scrollTop.scrollTopFom();
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message }])
            }
        );
    }

}
