import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Advertisement } from '../../../shared/class/advertisement';
import { AdvertisementService } from '../../../shared/services/advertisement.service';

@Component({
  selector: 'app-advertisement-detail',
  templateUrl: './advertisement-detail.component.html',
  styleUrls: ['./advertisement-detail.component.css']
})
export class AdvertisementDetailComponent implements OnInit {
	@Input() adv: Advertisement;
	constructor(
		private advertisementService: AdvertisementService,
		private route: ActivatedRoute,
		private location: Location
		) { }

	ngOnInit() {
		this.getAdv();
	}
	// Get adv by id
	getAdv() {
		const id = +this.route.snapshot.paramMap.get('id');
		this.advertisementService.getAdvertisement(id).subscribe(
			result => {
        	this.adv = result;
      },
      // (error) => {
      //   console.log(error);
      // }
      );
	}
	goBack() {
		this.location.back();
	}
	EditAdv() {
		this.advertisementService.updateAdv(this.adv).subscribe(() => this.goBack());
	}
}
