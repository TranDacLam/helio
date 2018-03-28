import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../shared/class/user';
import { LinkCardService } from '../../../shared/services/link-card.service';
import { DateValidators } from './../../../shared/validators/date-validators';
import { NumberValidators } from './../../../shared/validators/number-validators';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ToastrService } from 'ngx-toastr';
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
    // Return 1 object to parent
    @Output() is_btn_linkcard_app: EventEmitter<any> = new EventEmitter<any>();
    @Output() is_submit: EventEmitter<any> = new EventEmitter<any>();

    appForm: FormGroup;

    user_app = new User();

    // Enable/Disable input field when change input checkbox
    dis_input_app = {full_name: true, email: true, phone: true, birth_date: true, personal_id: true, address: true};

    msg_error: any;
    is_disable_checkbox: boolean = true;
    is_disabled_btn_app: boolean = true;

    errorMessage = '';

    constructor(
        private fb: FormBuilder, 
        private linkCardService: LinkCardService,
        private router: Router,
        private toastr: ToastrService
    ) { }

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
            email: [this.user_app.email, [Validators.required, Validators.email]],
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
        if(this.validateEmail()){
            this.errorMessage = 'Email không đúng định dạng';
            return;
        }
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
                this.msg_error = null;
                this.is_disable_checkbox = false;
                this.is_disabled_btn_app = false;
                this.is_btn_linkcard_app.emit(this.is_disabled_btn_app);
                this.is_submit.emit(true);
            },
            (error) => { 
                this.errorMessage = error.message; 
                this.msg_error = null;
                this.is_disable_checkbox = true;
                this.is_disabled_btn_app = true;
                this.is_btn_linkcard_app.emit(this.is_disabled_btn_app);
                this.is_submit.emit(true);
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
        Function stripText(): numbers only
        Author: Lam
    */
    stripText(value, field) {
        this.appForm.get(field).setValue(value.replace(/[^0-9]/g, ''));
    }

    /*
        Function stripEmail(): remove space
        Author: Lam
    */
    stripEmail(value){
        this.appForm.get('email').setValue(value.replace(/ /g,""));
    }

    /*
        Function validateEmail(): validate email format is email 
        Author: Lam
    */
    validateEmail(): boolean{
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let email = $("#search_email").val();
        let is_check = regex.test(email);
        if (!is_check) {
            return true;
        }
        return false;
    }

    /*
        Function onSubmitApp(): call service function updateUserApp() to update user app
        Author: Lam
    */
    onSubmitApp(){
        if(this.appForm.invalid){
            ValidateSubmit.validateAllFormFields(this.appForm);
        }else{
            let id = this.user_app.id;
            this.linkCardService.updateUserApp(this.appForm.value, id).subscribe(
                (data) => {
                    this.searchEmail(this.appForm.value.email);
                    this.toastr.success(`${data.message}`);
                    this.msg_error = null;
                    this.is_submit.emit(true);
                },
                (error) => {
                    if(error.code === 400){
                        this.msg_error = error.message;
                        this.is_submit.emit(true);
                    }else{
                        this.router.navigate(['/error', { message: error.message}]);
                    }
                }
            );
        }
    }

}
