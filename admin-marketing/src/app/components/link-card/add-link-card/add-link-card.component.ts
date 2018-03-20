import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { User } from '../../../shared/class/user';
import { LinkCardService } from '../../../shared/services/link-card.service';
import { Location } from '@angular/common';
import { FormUserAppComponent } from '../form-user-app/form-user-app.component';
import { FormUserEmbedComponent } from '../form-user-embed/form-user-embed.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-add-link-card',
    templateUrl: './add-link-card.component.html',
    styleUrls: ['./add-link-card.component.css'],
    providers: [LinkCardService]
})
export class AddLinkCardComponent implements OnInit {

    /*
        Author: Lam
    */

    // Inject the FormUserApp component into the private userappComponent property
    @ViewChild(FormUserAppComponent)
    private userappComponent: FormUserAppComponent;

    // Inject the FormUserEmbed component into the private userembedComponent property
    @ViewChild(FormUserEmbedComponent)
    private userembedComponent: FormUserEmbedComponent;

    // Check input fields 2 form
    status_error = {full_name: false, email: false, phone: false, birth_date: false, personal_id: false, address: false};

    constructor(
        private linkCardService: LinkCardService, 
        private location: Location,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }

    /*
        Function onCardLink():
         + Step 1: get user_app and user_embed from component child through @ViewChild
         + Step 2: Foreach and equal field to check and show error
         + Step 3: If not error, call service function Relate to create link card
         + Create success redirect to  link-card/detail with params query email and barcode
        Author: Lam
    */
    onCardLink(): void{
        let user_app = this.userappComponent.user_app;
        let user_embed = this.userembedComponent.user_embed;
        let isValid = false;
        let field_compare = {'full_name': '', 'email': '', 'phone': '', 'birth_date': '', 
            'personal_id': '', 'address': ''};

        Object.entries(user_app).forEach(([key, val]) => {
            if(key in field_compare){
                console.log(key);
                if(user_app[key] !== user_embed[key]){
                    this.status_error[key] = true;
                    isValid = true;
                }else{
                    this.status_error[key] = false;
                }
            }
        });
        
        if(isValid){
            this.toastr.error(`Lỗi, yêu cầu các trường thông tin tài khoản và thẻ phải trùng nhau`);
        }else{
            this.linkCardService.relate(user_app.email, user_embed.barcode).subscribe(
                (data) => {
                    this.toastr.error(`Bạn đã thực hiện liên kết thẻ với tài khoản Helio thành công.`);
                    this.router.navigate(['/link-card/detail/', user_app.id,{ email: user_app.email, barcode: user_embed.barcode}]);
                },
                (error) => {
                    if(error.code === 400){
                        this.toastr.error(`${error.message}`);
                    }else{
                        this.router.navigate(['/error', { message: error.message}]);
                    }
                }
            );
        }
    }

}
