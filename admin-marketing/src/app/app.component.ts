import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './shared/class/user';
import { UserService } from './shared/services/user.service';
import { VariableGlobals } from './shared/commons/variable_globals';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [UserService]
})
export class AppComponent {

    token = '';
  	
    constructor(
        private router: Router,
        private userService: UserService,
        public variable_globals: VariableGlobals,
        private toastr: ToastrService
    ) { 
        this.token = localStorage.getItem('auth_token');
        if(this.token){
            this.getUserByToken(this.token);
        }
    }

    /*
        Function: logout(): logout, remove token
        Author: Lam
    */
    logout(){
        localStorage.removeItem('auth_token');
        this.variable_globals.user_current = null;
        this.toastr.success(`Đăng xuất thành công`);
        this.router.navigate(['/login']);
    }

    /*
        Function: getUserByToken(): call service function getUserByToken() get user by token
        Author: Lam
    */
    getUserByToken(value){
        this.userService.getUserByToken(value).subscribe(
            (data) => {
                if(data.is_staff === false){
                    this.toastr.error("Tài khoản của bạn không có quyền đăng nhập vào Site Quản Trị Hệ Thống.");
                    this.router.navigate(['/login']);
                }else{
                    this.variable_globals.user_current = data;
                }
            },
            (error) => {
                localStorage.removeItem('auth_token');    
                this.toastr.error(error.message);                
                this.router.navigate(['/login']);
            }
        );
    }

}
