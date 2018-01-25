import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { User } from '../../../shared/class/user';
import { LinkCardService } from '../../../shared/services/link-card.service';
import { Location } from '@angular/common';
import { FormUserAppComponent } from '../form-user-app/form-user-app.component';
import { FormUserEmbedComponent } from '../form-user-embed/form-user-embed.component';

@Component({
    selector: 'app-add-link-card',
    templateUrl: './add-link-card.component.html',
    styleUrls: ['./add-link-card.component.css'],
    providers: [LinkCardService]
})
export class AddLinkCardComponent implements OnInit {

    @ViewChild(FormUserAppComponent)
    private userappComponent: FormUserAppComponent;

    @ViewChild(FormUserEmbedComponent)
    private userembedComponent: FormUserEmbedComponent;

    status_error = {full_name: false, email: false, phone: false, birth_date: false, personal_id: false, address: false};
    status_card_link = false;

    constructor(private linkCardService: LinkCardService, private location: Location) { }

    ngOnInit() {
    }

    onCardLink(): void{
        let user_app = this.userappComponent.user_app;
        let user_embed = this.userembedComponent.user_embed;

        this.status_card_link = false;

        Object.entries(user_app).forEach(([key, val]) => {
            if(key !== 'id'){
                if(user_app[key] !== user_embed[key]){
                    this.status_error[key] = true;
                    this.status_card_link = true;
                }else{
                    this.status_error[key] = false;
                }
            }
        });
        
        if(this.status_card_link == false){
            if(user_app.barcode){
                alert("User này đã liên kết trước đó.");
            }else{
                user_app.barcode = user_embed.barcode;
                this.linkCardService.updateUserApp(user_app, user_app.id).subscribe(success_app => {
                    console.log(success_app);
                    this.userappComponent.user_app = success_app;
                    location.href = "/card-link/detail/"+user_app.id+"?barcode="+user_embed.barcode;
                });
            }
        }
    }

}
