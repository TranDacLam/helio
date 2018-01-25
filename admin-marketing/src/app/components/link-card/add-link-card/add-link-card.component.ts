import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { User } from '../class/user';
import { LinkCardService } from '../../../shared/services/link-card.service';
import { Location } from '@angular/common';
import { FormUserAppComponent } from '../form-user-app/form-user-app.component';
import { FormUserEmbedComponent } from '../form-user-embed/form-user-embed.component';

@Component({
    selector: 'app-add-link-card',
    templateUrl: './add-link-card.component.html',
    styleUrls: ['./add-link-card.component.css']
})
export class AddLinkCardComponent implements OnInit {

    @ViewChild(FormUserAppComponent)
    private userappComponent: FormUserAppComponent;

    @ViewChild(FormUserEmbedComponent)
    private userembedComponent: FormUserEmbedComponent;

    status_error = {name: false, email: false, phone: false, birth_date: false, government_id: false, address: false};
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
            if(user_embed.app_id){
                alert("User này đã liên kết trước đó.");
            }else{
                user_embed.app_id = user_app.id;
                this.linkCardService.updateUserEmbed(user_embed).subscribe(success_embed => {
                    console.log(success_embed);
                    this.userembedComponent.user_embed = success_embed;
                    location.href = "/card-link-success?app_id="+user_app.id+"&embed_id="+user_embed.barcode;
                });
            }
        }
    }

}
