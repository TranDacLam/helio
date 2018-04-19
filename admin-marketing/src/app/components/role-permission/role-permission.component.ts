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

    changePermission(event, model, role, permission){
        let obj = {key_model: model.key, role: role.id, permission: permission};
        let is_permission = false;
        let getClass = `permission-${model.id}-${role.id}`;
        let getid = `${permission}-${model.id}-${role.id}`;

        if(event.target.checked){
            $('.'+getClass).prop('checked', false);
            $('#'+getid).prop('checked', true);
            for(let i=0; i<this.list_role_permission.length; i++){
                if(this.list_role_permission[i].key_model === obj.key_model && 
                    this.list_role_permission[i].role === obj.role){
                    this.list_role_permission[i].permission = permission;
                    is_permission = true;
                    break;
                }
            }
            if(is_permission === false){
                this.list_role_permission.push(obj);
            }
        }else{
            $('.'+getClass).prop('checked', false);
            this.list_role_permission = this.list_role_permission.filter(
                item => !(item.role === obj.role && item.key_model === obj.key_model)
            );
        }
    }

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
