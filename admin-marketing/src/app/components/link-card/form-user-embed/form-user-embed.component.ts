import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Customer } from '../../../shared/class/customer';
import { LinkCardService } from '../../../shared/services/link-card.service';
import 'rxjs/add/observable/throw';

@Component({
  selector: 'form-user-embed',
  templateUrl: './form-user-embed.component.html',
  styleUrls: ['./form-user-embed.component.css'],
  providers: [LinkCardService]
})
export class FormUserEmbedComponent implements OnInit {

    @Input() status_error;

    embedForm: FormGroup;

    user_embed = new Customer();

    dis_input_embed = {barcode: true, full_name: true, email: true, phone: true, 
                        birth_date: true, personal_id: true, address: true};

    errorMessage = '';

    constructor(private fb: FormBuilder, private linkCardService: LinkCardService) { }

    ngOnInit() {
        this.userEmbedForm();
    }

    userEmbedForm(){
        this.embedForm = this.fb.group({
            barcode: [this.user_embed.barcode, [Validators.required]],
            full_name: [this.user_embed.full_name, [Validators.required]],
            email: [this.user_embed.email, [Validators.required, Validators.email]],
            phone: [this.user_embed.phone, Validators.required],
            birth_date: [this.user_embed.birth_date, Validators.required],
            personal_id: [this.user_embed.personal_id, Validators.required],
            address: [this.user_embed.address, Validators.required],
        });
    }

    searchBarcode(value){
        let barcode = parseInt(value);
        this.linkCardService.getBarcode(barcode).subscribe(
            (data) => {
                this.user_embed = data;
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
            (error) => { this.errorMessage = error.message; } 
        );
    }


    onSubmitEmbed(){
        this.linkCardService.updateUserEmbed(this.embedForm.value).subscribe(put_embed => {
            console.log(put_embed);
        });
    }

}
