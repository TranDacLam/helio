import { Component, OnInit } from '@angular/core';

import { Advertisement } from '../../../shared/class/advertisement';
import { AdvertisementService } from '../../../shared/services/advertisement.service';

import { Router } from "@angular/router";

@Component({
  selector: 'app-advertisement-add',
  templateUrl: './advertisement-add.component.html',
  styleUrls: ['./advertisement-add.component.css']
})
export class AdvertisementAddComponent implements OnInit {

   	constructor(
   		private advertisementService: AdvertisementService,
        private router: Router,
   	){ }

   	advs: Advertisement[] = [];
   	errorMessage: string = "";
   	is_show = false;

   	ngOnInit() {
   	}
    /*
        POST: Create New Advertiment
        @author: TrangLe
     */
   	CreateAdv(advForm: any) {
   		this.advertisementService.addAdvertisement( advForm ).subscribe(
			(resultAdv) => {
				this.advs.push(resultAdv);
                this.router.navigate(['/advertisement-list', { message_post: advForm.name} ])
			},
            (error) => {
                if (error.status == 400 ) {
                    console.log(error.json());
                    this.errorMessage = error.json().name
                } else {
                    this.router.navigate(['/error', { message: error.json().message }])
                }
            }
        );
    }
}
