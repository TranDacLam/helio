import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../class/user';
import { LinkCardService } from '../../../shared/services/link-card.service';

@Component({
  selector: 'app-form-user-embed',
  templateUrl: './form-user-embed.component.html',
  styleUrls: ['./form-user-embed.component.css']
})
export class FormUserEmbedComponent implements OnInit {

    @Input() status_error;

    embedForm: FormGroup;

    all_user_embed: User[];

    user_embed = new User();

    dis_input_embed = {barcode: true, name: true, email: true, phone: true, birth_date: true, government_id: true, address: true};

    search_barcode = '';

    status_barcode = false;

    status_card_link = false;

    constructor(private fb: FormBuilder, private linkCardService: LinkCardService) { }

    ngOnInit() {
        this.getAllUserEmbed();
        this.userEmbedForm();
    }

    userEmbedForm(){
        this.embedForm = this.fb.group({
            barcode: [this.user_embed.barcode, [Validators.required]],
            name: [this.user_embed.name, [Validators.required]],
            email: [this.user_embed.email, [Validators.required, Validators.email]],
            phone: [this.user_embed.phone, Validators.required],
            birth_date: [this.user_embed.birth_date, Validators.required],
            government_id: [this.user_embed.government_id, Validators.required],
            address: [this.user_embed.address, Validators.required],
        });
    }

    searchBarcode(value){
        let barcode = parseInt(value);
        this.user_embed = this.all_user_embed.find(x => x.barcode == barcode);
        if(this.user_embed){
            this.embedForm.setValue({
                barcode: this.user_embed.barcode,
                name: this.user_embed.name,
                email: this.user_embed.email,
                phone: this.user_embed.phone,
                birth_date: this.user_embed.birth_date,
                government_id: this.user_embed.government_id,
                address: this.user_embed.address
            });
            this.search_barcode = '';
            this.status_barcode = false;
        }else{
            this.status_barcode = true;
        }
    }


    onSubmitEmbed(){
        console.log(this.embedForm.value);
        this.linkCardService.updateUserEmbed(this.embedForm.value).subscribe(put_embed => {
            console.log(put_embed);
            this.user_embed = put_embed;
        });
    }

    getAllUserEmbed(): void{
        this.linkCardService.getAllUserEmbed().subscribe(data_embed => {
            this.all_user_embed = data_embed;
        });
    }

}
