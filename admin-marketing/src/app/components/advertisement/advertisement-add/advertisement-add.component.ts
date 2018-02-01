import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

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
   		private location: Location,
      private router: Router,
   	){ }

   	advs: Advertisement[] = [];
   	messAdv: string = "";
   	is_show = false;

   	ngOnInit() {
   	}
   	goBack() {
   		this.location.back();
   	}
   	CreateAdv(advForm: any) {
   		this.advertisementService.addAdvertisement( advForm )
   			.subscribe(
   				resultAdv => {
   					this.advs.push(resultAdv);
   			});
        this.router.navigate(['/advertisement-list', { message_post: advForm.name} ])
   }
}
