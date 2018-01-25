import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../shared/class/user';
import { LinkCardService } from '../../../shared/services/link-card.service';

@Component({
  selector: 'form-user-app',
  templateUrl: './form-user-app.component.html',
  styleUrls: ['./form-user-app.component.css'],
  providers: [LinkCardService]
})
export class FormUserAppComponent implements OnInit {

    @Input() status_error;

    appForm: FormGroup;

    user_app = new User();

    dis_input_app = {full_name: true, email: true, phone: true, birth_date: true, personal_id: true, address: true};
    status_search = false;


    constructor(private fb: FormBuilder, private linkCardService: LinkCardService) { }

    ngOnInit() {;
        this.userAppForm();
    }

    userAppForm(){
        this.appForm = this.fb.group({
            full_name: [this.user_app.full_name, [Validators.required]],
            email: [this.user_app.email, [Validators.required, Validators.email]],
            phone: [this.user_app.phone, Validators.required],
            birth_date: [this.user_app.birth_date, Validators.required],
            personal_id: [this.user_app.personal_id, Validators.required],
            address: [this.user_app.address, Validators.required],
        });
    }

    searchEmail(value){
        this.linkCardService.getEmail(value).subscribe(data => {
            console.log(data);
            if(data){
                this.user_app = data;
                this.appForm.setValue({
                    full_name: this.user_app.full_name,
                    email: this.user_app.email,
                    phone: this.user_app.phone,
                    birth_date: this.user_app.birth_date,
                    personal_id: this.user_app.personal_id,
                    address: this.user_app.address
                });
                this.status_search = false;
            }else{
                this.status_search = true;
            }
        });
    }

    onSubmitApp(){
        let id = this.user_app.id;
        this.linkCardService.updateUserApp(this.appForm.value, id).subscribe(put_user => {
            console.log(put_user);
            this.user_app = put_user;
        });
    }

}
