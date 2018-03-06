import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../../shared/class/user';
import { UserService } from '../../../shared/services/user.service';

import { env } from '../../../../environments/environment';

// Using bootbox 
declare var bootbox:any;

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
  providers: [ UserService ]
})
export class UserDetailComponent implements OnInit {

    user: User;
	formUser: FormGroup;
	user_form = new User();
	readonly_value = true;

    errorMessage: string ='';
    api_domain:string = "";
    
	constructor( 
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private userService:  UserService,
        private router: Router,
        ) { 
            this.api_domain = env.api_domain_root;
        }

	ngOnInit() {
		this.createFormUser();
        this.getUserById();
	}

	// Create Form 
	createFormUser() {
		this.formUser = this.fb.group({
        email: [this.user_form.email, [Validators.required, Validators.email]],
        full_name: [this.user_form.full_name, [Validators.required]],
        birth_date: [this.user_form.birth_date],
        phone: [this.user_form.phone, [Validators.required]],
        personal_id: [this.user_form.personal_id],
        country: [this.user_form.country],
        address: [this.user_form.address],
        city: [this.user_form.city],
        avatar: [this.user_form.avatar],
        password: [this.user_form.password],
        role: [this.user_form.role, [Validators.required]],
        is_active: [this.user_form.is_active]
    })
	}

    /*
        GET: Get User By Id
        Call service user.service
        @author: Trangle
     */
    getUserById() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.userService.getUserById(id)
        .subscribe(
            (data) => {
                this.user = data;
            },
            (error) =>  {
                this.errorMessage = <any>error
            }
        );
    }

    /*
        DELETE: Delete User By Id
        Call service user.service
        @author: Trangle
    */
    deleteUserById(user: User){
        this.userService.deleteUserById(user)
            .subscribe(
                () => {
                    this.router.navigate(['/user-list', { message_del: user.email} ]);
                },
                (error) =>  {
                    console.log(error);
                    // this.router.navigate(['/error', { message: error }])
                }
           );
    }
   
    // upload image 
    // FileReader: reading file contents
    onFileChange(event) {
        let reader = new FileReader();
        let input_id = $(event.target).attr('id');
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formUser.get(input_id).setValue({ filename: file.name, filetype: file.type, value: file });
        }
    }


    // Show pass word
 	showPassword(input: any): any {
 		input.type = input.type === 'password' ? 'text' : 'password';
 	}

 	// Change attribute readonly password
 	ChangeReadonly(event) {
 		if(event.target.checked) {
 			this.readonly_value = false;
 		} else {
 			this.readonly_value= true;
 		}
 	}

     /* 
        Confirm delete feedback detail
        Using: bootbox plugin
        @author: Trangle
    */
    confirmDeleteFeedback(user: User) {
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa phản hồi này.",
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
                    // Check result = true. call function callback
                    this.deleteUserById(user)
                }
            }
        });
    }

}
