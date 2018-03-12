import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../shared/class/user';
import { LinkCardService } from '../../../shared/services/link-card.service';
import { DateValidators } from './../../../shared/validators/date-validators';
import { NumberValidators } from './../../../shared/validators/number-validators';
import 'rxjs/add/observable/throw';

@Component({
  selector: 'form-user-app',
  templateUrl: './form-user-app.component.html',
  styleUrls: ['./form-user-app.component.css'],
  providers: [LinkCardService]
})
export class FormUserAppComponent implements OnInit {

    /*
        Author: Lam
    */

    // receive value from parrent add-link-card component
    @Input() status_error;

    appForm: FormGroup;

    user_app = new User();

    // Enable/Disable input field when change input checkbox
    dis_input_app = {full_name: true, email: true, phone: true, birth_date: true, personal_id: true, address: true};

    msg_success = ''; // Message show error
    msg_error: any;

    errorMessage = '';

    constructor(private fb: FormBuilder, private linkCardService: LinkCardService) { }

    ngOnInit() {;
        this.userAppForm();
    }

    /*
        Function userAppForm(): create form
        Author: Lam
    */
    userAppForm(){
        this.appForm = this.fb.group({
            full_name: [this.user_app.full_name, [Validators.required]],
            email: [this.user_app.email, [Validators.email]],
            phone: [this.user_app.phone, 
                [Validators.required, NumberValidators.validPhone]],
            birth_date: [this.user_app.birth_date, 
                [Validators.required, DateValidators.formatDate]],
            personal_id: [this.user_app.personal_id, 
                [Validators.required, NumberValidators.validPersonID]],
            address: [this.user_app.address, Validators.required],
        });
    }


    /*
        Function searchEmail(): call service function getEmail() to get user app by email
        Author: Lam
    */
    searchEmail(value){
        this.linkCardService.getEmail(value).subscribe(
            (data) => {
                this.user_app = data;
                this.appForm.setValue({
                    full_name: this.user_app.full_name,
                    email: this.user_app.email,
                    phone: this.user_app.phone,
                    birth_date: this.user_app.birth_date,
                    personal_id: this.user_app.personal_id,
                    address: this.user_app.address
                });
                this.errorMessage = '';
            },
            (error) => { 
                this.errorMessage = error.message; 
                this.appForm.setValue({
                    full_name: null,
                    email: null,
                    phone: null,
                    birth_date: null,
                    personal_id: null,
                    address: null
                });
            } 
        );
    }

    /*
        Function onSubmitApp(): call service function updateUserApp() to update user app
        Author: Lam
    */
    onSubmitApp(){
        let id = this.user_app.id;
        this.linkCardService.updateUserApp(this.appForm.value, id).subscribe(
            (data) => {
                this.msg_success = data.message;
                this.msg_error = null;
            },
            (error) => {
                this.msg_error = error.message;
                this.msg_success = '';
            }
        );
    }

}
