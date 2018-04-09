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
        this.variable_globals.user_current = JSON.parse(localStorage.getItem('current_user'));
        if(!localStorage.getItem('current_user') || !localStorage.getItem('auth_token')){
            localStorage.removeItem('auth_token');
            localStorage.removeItem('current_user');
            this.router.navigate(['/login']);
        }
    }

    /*
        Function: logout(): logout, remove token
        Author: Lam
    */
    logout(){
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        this.variable_globals.user_current = null;
        this.toastr.success(`Đăng xuất thành công`);
        this.router.navigate(['/login']);
    }

}
