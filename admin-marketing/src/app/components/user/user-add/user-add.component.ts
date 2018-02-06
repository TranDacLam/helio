import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { User,roles_user } from '../../../shared/class/user';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {

	formUser: FormGroup;
	user_form = new User();
	users: User[];
	roles_user = roles_user;
  
  @ViewChild('fileInput') fileInput: ElementRef;

	constructor(
		private fb: FormBuilder
		) {
	}

 	ngOnInit() {
 	 	this.createForm();
 	}

 	createForm() {
 		this.formUser = this.fb.group({
            email: [this.user_form.email, [Validators.required, Validators.email]],
            full_name: [this.user_form.full_name, [Validators.required]],
            birth_date: [this.user_form.birth_date],
            phone: [this.user_form.phone, [Validators.required]],
            personal_id: [this.user_form.personal_id],
            country: [this.user_form.country],
            address: [this.user_form.address],
            city: [this.user_form.city],
            image: [this.user_form.image],
            password: [this.user_form.password],
            role_user: [this.user_form.role_user, [Validators.required]]
        });
 	}
   // upload image 
    // FileReader: reading file contents
    onFileChange(e) {
      let reader = new FileReader();
      if(e.target.files && e.target.files.length > 0) {
        let file = e.target.files[0];
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.formUser.get('image').setValue(file)
        };
      }
    }
    // Clear file 
    clearFile() {
      this.formUser.get('image').setValue(null);
      this.fileInput.nativeElement.value = '';
    }

 	// Show pass word
 	showPassword(input: any): any {
 		input.type = input.type === 'password' ? 'text' : 'password';
 	}

}
