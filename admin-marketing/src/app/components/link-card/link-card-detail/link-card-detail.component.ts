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

    getUser(): void{
        const app_id = +this.route.snapshot.paramMap.get('id');
        const barcode = +this.route.snapshot.queryParamMap.get('barcode');
        console.log(app_id);
        console.log(barcode);
        this.linkCardService.getUserApp(app_id).subscribe(data_app => {
            console.log(data_app);
            this.user_app = data_app;
        });
        this.linkCardService.getUserEmbed(barcode).subscribe(data_embed => {
            console.log(data_embed);
            this.user_embed = data_embed;
        });
    }

}
