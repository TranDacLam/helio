import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../../shared/class/user';
import { UserService } from '../../../shared/services/user.service';
import { UserValidators } from './../../../shared/validators/user-validators';

import { DatePipe } from '@angular/common';
import * as moment from 'moment';

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
    errors: string='';
    api_domain:string = "";
    
	constructor( 
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private userService:  UserService,
        private router: Router,
        private datePipe: DatePipe,
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
        birth_date: [this.user_form.birth_date ? moment(this.user_form.birth_date,"DD/MM/YYYY").toDate() : null],
        phone: [this.user_form.phone, [Validators.required,UserValidators.phoneValidators]],
        personal_id: [this.user_form.personal_id],
        country: [this.user_form.country],
        address: [this.user_form.address],
        city: [this.user_form.city],
        avatar: [this.user_form.avatar],
        password: [this.user_form.password, [Validators.required, UserValidators.passwordValidators]],
        role: [this.user_form.role ? this.user_form.role : ''],
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
                this.router.navigate(['/error', { message: error.json().message }])
            }
        );
    }

    onSubmit() {
        var self = this;
        let userFormGroup = this.convertFormGroupToFormData(this.formUser);
        this.userService.updateUser(userFormGroup, this.user.id).subscribe(
                (data) => {
                    // Navigate to promotion page where success
                    self.router.navigate(['/user-list', { message_put: this.formUser.value['email']} ])
                }, 
                (error) => {
                    if(error.code == 400) {
                        this.errorMessage = error.message
                    } else if(error.code == 405) {
                        this.errors = error.message;
                    } else {
                       self.router.navigate(['/error', { message: error.message }]);
                    }
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
                    if(error.status == 405) {
                        this.errors = error.json().message
                    } else {
                        this.router.navigate(['/error', { message: error.json().message }])
                    }
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


    /*
        Show password 
        if type = 'password' is hide
        else type= "text" is show
     */
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
            message: "Bạn muốn xóa user này.",
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

    /*
        Convert form group to form data to submit form
        @author: trangle
    */
    private convertFormGroupToFormData(userForm: FormGroup) {
        // Convert FormGroup to FormData
        let userValues = userForm.value;
        let userFormData:FormData = new FormData(); 
        if (userValues){
            /* 
                Loop to set value to formData
                Case1: if value is null then set ""
                Case2: If key is image field then set value have both file and name
                Else: Set value default
            */
            Object.keys(userValues).forEach(k => { 
                if(userValues[k] == null) {
                    userFormData.append(k, '');
                } else if (k === 'avatar') {
                    userFormData.append(k, userValues[k].value, userValues[k].name);
                } else if(k === 'birth_date') {
                    userFormData.append(k, this.transformDate(userValues[k]))
                } else {
                    userFormData.append(k, userValues[k]);
                }
            });
        }
        return userFormData;
    }

    transformDate(date) {
        return this.datePipe.transform(date, 'dd/MM/yyyy');
    }

    removeErrorMessage() {
        this.errorMessage = '';
    }
}
