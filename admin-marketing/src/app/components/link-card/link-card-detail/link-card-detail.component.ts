import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/class/user';
import { Customer } from '../../../shared/class/customer';
import { LinkCardService } from '../../../shared/services/link-card.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-link-card-detail',
    templateUrl: './link-card-detail.component.html',
    styleUrls: ['./link-card-detail.component.css'],
    providers: [LinkCardService]
})
export class LinkCardDetailComponent implements OnInit {

    user_app = new User();
    user_embed = new Customer();

    constructor(private linkCardService: LinkCardService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.getUser();
    }

    /*
        Function getUser(): 
         + Get email user app and barcode user emebed 
         + Call service function getEmail() by email and function getBarcode() by barcode
        Author: Lam
    */
    getUser(): void{
        const email = this.route.snapshot.paramMap.get('email');
        const barcode = +this.route.snapshot.queryParamMap.get('barcode');
        this.linkCardService.getEmail(email).subscribe(data_app => {
            this.user_app = data_app;
        });
        this.linkCardService.getBarcode(barcode).subscribe(data_embed => {
            this.user_embed = data_embed;
        });
    }

}
