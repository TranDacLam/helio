import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { User } from '../../../shared/class/user';
import { UserService } from '../../../shared/services/user.service';
import { UserValidators } from './../../../shared/validators/user-validators';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { NumberValidators } from './../../../shared/validators/number-validators';

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
        private toastr: ToastrService,
        ) { 
            this.api_domain = env.api_domain_root;
        }

	ngOnInit() {
       this.getUserById();
		
	}

	// Create Form 
	createFormUser() {
		this.formUser = this.fb.group({
        email: [this.user.email, [Validators.required, UserValidators.emailValidators]],
        full_name: [this.user.full_name, [Validators.required]],
        birth_date: [this.user.birth_date ? moment(this.user.birth_date,"DD/MM/YYYY").toDate() : '', [UserValidators.birtdateValidators, UserValidators.formatBirtday]],
        phone: [this.user.phone, [Validators.required,NumberValidators.validPhone]],
        personal_id: [this.user.personal_id, [NumberValidators.validPersonID]],
        country: [this.user.country],
        address: [this.user.address],
        city: [this.user.city],
        avatar: [this.user.avatar],
        new_password: ['', [UserValidators.passwordValidators, Validators.maxLength(32)]],
        role: [this.user.role ? this.user.role['id'] : ''],
        is_active: [this.user.is_active],
        is_staff:[this.user.is_staff]
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
                this.createFormUser();
            },
            (error) =>  {
                this.router.navigate(['/error', { message: error.json().message }])
            }
        );
    }

    onSubmit() {
        this.formUser.controls['birth_date'].setValidators([
            UserValidators.birtdateValidators, UserValidators.formatBirtday]);
        this.formUser.controls['birth_date'].updateValueAndValidity();
        if (this.formUser.invalid) {
            ValidateSubmit.validateAllFormFields(this.formUser);
        } else {
            var self = this;
            this.formUser.value.birth_date = $('#birth_date').val();
            let userFormGroup = this.convertFormGroupToFormData(this.formUser);
            this.userService.updateUser(userFormGroup, this.user.id).subscribe(
                (data) => {
                    // Navigate to promotion page where success
                    self.toastr.success(`Chỉnh sửa "${this.formUser.value.email}" thành công`);
                    self.router.navigate(['/user-list']);
                }, 
                (error) => {
                    if(error.code == 400) {
                        if (error.message.non_field_errors) {
                            self.toastr.error(`${error.message.non_field_errors}`);
                        } else {
                            this.errorMessage = error.message
                        }
                    } else if(error.code == 405) {
                        self.toastr.error(`${error.message}`);
                    } else {
                       self.router.navigate(['/error', { message: error.message }]);
                    }
                }
            );
        }
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
                    this.toastr.success(`Xóa "${user.email}" thành công`);
                    this.router.navigate(['/user-list']);
                },
                (error) =>  {
                    if(error.status == 405) {
                        this.toastr.error(`${error.json().message}`);
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
        if (input.type = input.type === "password") {
            input.type = "text";
            $('span#toggleShowHide').addClass('fa fa-eye').removeClass('fa-eye-slash');
        } else {
            input.type = "password";
            $('span#toggleShowHide').addClass('fa-eye-slash').removeClass('fa-eye');
        }
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
            message: "Bạn muốn xóa User này?",
            buttons: {
                cancel: {
                    label: "HỦY"
                },
                confirm: {
                    label: "XÓA"
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
                } else {
                    userFormData.append(k, userValues[k]);
                }
            });
        }
        return userFormData;
    }

    removeErrorMessage() {
        this.errorMessage = '';
    }
}
