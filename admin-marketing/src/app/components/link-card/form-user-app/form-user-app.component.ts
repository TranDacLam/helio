import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../class/user';
import { LinkCardService } from '../../../shared/services/link-card.service';

@Component({
  selector: 'app-form-user-app',
  templateUrl: './form-user-app.component.html',
  styleUrls: ['./form-user-app.component.css']
})
export class FormUserAppComponent implements OnInit {

    @Input() status_error;

    appForm: FormGroup;

    all_user_app: User[];
    user_app = new User();

    dis_input_app = {name: true, email: true, phone: true, birth_date: true, government_id: true, address: true};
    search_email = '';
    status_search = false;


    constructor(private fb: FormBuilder, private linkCardService: LinkCardService) { }

    ngOnInit() {
        this.getAllUserApp();
        this.userAppForm();
    }

    userAppForm(){
        this.appForm = this.fb.group({
            name: [this.user_app.name, [Validators.required]],
            email: [this.user_app.email, [Validators.required, Validators.email]],
            phone: [this.user_app.phone, Validators.required],
            birth_date: [this.user_app.birth_date, Validators.required],
            government_id: [this.user_app.government_id, Validators.required],
            address: [this.user_app.address, Validators.required],
        });
    }

    searchEmail(event){
        if(event.target.value){
            this.status_search = true;
        }else{
            this.status_search = false;
        }
    }

    getEmail(user){
        this.user_app = user;
        let date = new Date(this.user_app.birth_date);
        this.appForm.setValue({
            name: this.user_app.name,
            email: this.user_app.email,
            phone: this.user_app.phone,
            birth_date: this.user_app.birth_date,
            government_id: this.user_app.government_id,
            address: this.user_app.address
        })
        this.search_email = '';
        this.status_search = false;
    }

    onSubmitApp(){
        let id = this.user_app.id;
        this.linkCardService.updateUserApp(this.appForm.value, id).subscribe(put_app => {
            console.log(put_app);
            this.user_app = put_app;
            this.getAllUserApp();
        });
    }

    getAllUserApp(): void{
        this.linkCardService.getAllUserApp().subscribe(data_app => {
            this.all_user_app = data_app;
        });
    }

}
