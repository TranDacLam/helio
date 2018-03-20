import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../../shared/class/customer';
import { LinkCardService } from '../../../shared/services/link-card.service';
import { DateValidators } from './../../../shared/validators/date-validators';
import { NumberValidators } from './../../../shared/validators/number-validators';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import 'rxjs/add/observable/throw';

@Component({
  selector: 'form-user-embed',
  templateUrl: './form-user-embed.component.html',
  styleUrls: ['./form-user-embed.component.css'],
  providers: [LinkCardService]
})
export class FormUserEmbedComponent implements OnInit {

    /*
        Author: Lam
    */

    // receive value from parrent add-link-card component
    @Input() status_error;

    embedForm: FormGroup;

    user_embed = new Customer();

    // Enable/Disable input field when change input checkbox
    dis_input_embed = {barcode: true, full_name: true, email: true, phone: true, 
                        birth_date: true, personal_id: true, address: true};

    msg_success = ''; // Message show error
    msg_error: any;

    errorMessage = '';

    constructor(
        private fb: FormBuilder, 
        private linkCardService: LinkCardService,
        private router: Router
    ) { }

    ngOnInit() {
        this.userEmbedForm();
    }

    /*
        Function userAppForm(): create form
        Author: Lam
    */
    userEmbedForm(){
        this.embedForm = this.fb.group({
            barcode: [this.user_embed.barcode, [Validators.required]],
            full_name: [this.user_embed.full_name, [Validators.required]],
            email: [this.user_embed.email, [Validators.email]],
            phone: [this.user_embed.phone, 
                [Validators.required, NumberValidators.validPhone]],
            birth_date: [this.user_embed.birth_date, 
                [Validators.required, DateValidators.formatDate]],
            personal_id: [this.user_embed.personal_id, 
                [Validators.required, NumberValidators.validPersonID]],
            address: [this.user_embed.address, Validators.required],
        });
    }

    /*
        Function searchBarcode(): call service function getBarcode() to get user embed by barcode
        Author: Lam
    */
    searchBarcode(value){
        let barcode = parseInt(value);
        this.linkCardService.getBarcode(barcode).subscribe(
            (data) => {
                this.user_embed = data.message;
                this.embedForm.setValue({
                    barcode: this.user_embed.barcode,
                    full_name: this.user_embed.full_name,
                    email: this.user_embed.email,
                    phone: this.user_embed.phone,
                    birth_date: this.user_embed.birth_date,
                    personal_id: this.user_embed.personal_id,
                    address: this.user_embed.address
                });
                this.errorMessage = '';
            },
            (error) => { 
                this.errorMessage = error.message; 
                this.embedForm.setValue({
                    barcode: null,
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
    stripText(control: FormControl) {
        control.setValue(control.value.replace(/[^0-9]/g, ''));
    }

    /*
        Function stripText(): numbers only
        Author: Lam
    */
    stripBarcode(search_barcode) {
        $('#get_barcode').val(search_barcode.replace(/[^0-9]/g, ''));
    }

    /*
        Function onSubmitEmbed(): call service function updateUserEmbed() to update user embed
        Author: Lam
    */
    onSubmitEmbed(){
        if(this.embedForm.invalid){
            ValidateSubmit.validateAllFormFields(this.embedForm);
        }else{
            this.linkCardService.updateUserEmbed(this.embedForm.value).subscribe(
                (data) => {
                    this.searchBarcode(this.embedForm.value.barcode);
                    this.msg_success = data.message;
                    this.msg_error = null;
                },
                (error) => {
                    if(error.code === 400){
                        this.msg_error = error.message;
                        this.msg_success = '';
                    }else{
                        this.router.navigate(['/error', { message: error.message}]);
                    }
                }
            );
        }
    }

}
