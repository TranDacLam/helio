import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User,roles_user } from '../../../shared/class/user';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

	formUser: FormGroup;
	user_form = new User();
	readonly_value = true;

	constructor( private fb: FormBuilder) { }

	ngOnInit() {
		this.createFormUser();
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
        role_user: [this.user_form.role_user, [Validators.required]] 
    })
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

}
