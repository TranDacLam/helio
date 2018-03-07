import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";

import { User } from '../../../shared/class/user';
import { Role } from '../../../shared/class/role';

import { UserService } from '../../../shared/services/user.service';
import { RoleService } from '../../../shared/services/role.service';

import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css'],
  providers: [RoleService, UserService]
})
export class UserAddComponent implements OnInit {

	formUser: FormGroup;
	user_form = new User();

	users: User[] = [];
    roles: Role[];

    errorMessage: string="";

	constructor(
		private fb: FormBuilder,
        private userService: UserService,
        private roleService: RoleService,
        private router: Router,
        private datePipe: DatePipe,
		) {
	}

 	ngOnInit() {
        this.getAllRoles();
 	 	this.createForm();
 	}

 	createForm() {
 		this.formUser = this.fb.group({
            email: [this.user_form.email, [Validators.required, Validators.email]],
            full_name: [this.user_form.full_name, [Validators.required]],
            phone: [this.user_form.phone, [Validators.required]],
            personal_id: [this.user_form.personal_id],
            country: [this.user_form.country],
            address: [this.user_form.address],
            city: [this.user_form.city],
            avatar: [this.user_form.avatar, [Validators.required]],
            password: [this.user_form.password, [Validators.required]],
            is_active: [this.user_form.is_active],
            role: [this.user_form.role],
            birth_date: [this.user_form.birth_date ? moment(this.user_form.birth_date,"DD/MM/YYYY").toDate() : ''],
        });
 	}

    getAllRoles() {
        this.roleService.getAllRoles().subscribe(
            (result) => {
                    this.roles = result
                },
            (error) => {
                this.router.navigate(['/error', { message: error.json().message }])
            }
        )
    }

    onSubmit() {
        var self = this;
        let userFormGroup = this.convertFormGroupToFormData(this.formUser);
        this.userService.createUser(userFormGroup).subscribe(
            (data) => {
                self.users.push(data);
                self.router.navigate(['/user-list', { message_post: this.formUser.value['email']} ]);
            },
            (error) => {
                this.errorMessage = <any>error;
            }
        )
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

 	// Show password
 	showPassword(input: any): any {
 		input.type = input.type === 'password' ? 'text' : 'password';
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
}
