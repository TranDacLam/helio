import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/class/user';
import { Customer } from '../../../shared/class/customer';
import { LinkCardService } from '../../../shared/services/link-card.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-link-card-detail',
    templateUrl: './link-card-detail.component.html',
    styleUrls: ['./link-card-detail.component.css'],
    providers: [LinkCardService]
})
export class LinkCardDetailComponent implements OnInit {

    user_app = new User();
    user_embed = new Customer();

    constructor(
        private linkCardService: LinkCardService, 
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {
        this.getUser();
    }

    /*
        Function getUser(): 
         + Get email user app and barcode user emebed  from param query
         + Call service function getEmail() by email and function getBarcode() by barcode
        Author: Lam
    */
    getUser(): void{
        let email;
        let barcode;
        this.route.params.subscribe(params => {
            email = params.email;
            barcode = params.barcode;
        });

        this.linkCardService.getEmail(email).subscribe(data_app => {
            this.user_app = data_app;
        });
        this.linkCardService.getBarcode(barcode).subscribe(data_embed => {
            this.user_embed = data_embed.message;
        });
    }

    /*
        Function onDelete(): 
         + Get id user app
         + Call service function onDelete() by id to delete link card
        Author: Lam
    */
    onDelete(): void{
        const id = this.user_app.id;
        this.linkCardService.delLinkCard(id).subscribe(
            (data) => {
                this.router.navigate(['/list-link-card', { message: "Xóa Thành Công" }]); // redirect list link card
            },
            (error) => {
                this.router.navigate(['/list-link-card', { messafe: error.message }]); // redirect list link card
            }
        );
    }

}
