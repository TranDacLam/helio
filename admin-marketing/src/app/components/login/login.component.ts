import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../../shared/services/auth.service';
import { User } from './../../shared/class/user';
import { env } from './../../../environments/environment';
import 'rxjs/add/observable/throw';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [AuthService]
})
export class LoginComponent implements OnInit {

    formLogin: FormGroup;
    user: User = new User();

    msg_error: string = '';
    key_recaptcha: string = '';
    message_result: string = '';

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) { 
        this.key_recaptcha = env.key_recaptcha 
    }

    ngOnInit() {
        if(localStorage && localStorage.getItem('auth_token')){
            this.router.navigateByUrl('/');
        }
        this.route.params.subscribe(params => {
            if(params.message){
                this.message_result = params.message;
                setTimeout(()=>{
                      this.message_result = '';
                },7000);
            }
        });
        this.creatForm();
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formLogin = this.fb.group({
            email: [this.user.email, Validators.required],
            password: [this.user.password, Validators.required],
            captcha: ['', Validators.required]
        });
    }

    /*
        function onSubmit(): Call service function auth
        author: Lam
    */ 
    onSubmit(){
        this.message_result = '';
        this.authService.auth(this.formLogin.value).subscribe(
            (data) => {
               localStorage.setItem('auth_token', data.token);
               this.router.navigateByUrl('/');
            },
            (error) => {
                this.msg_error = error.non_field_errors[0] ? error.non_field_errors[0] : "Lỗi";
            }
        );
    }

}
