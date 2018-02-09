import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
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
		private location: Location,
		private router: Router
		) { }

	ngOnInit() {
		this.getAdv();
	}
	/*
		GET: Get Advertiment By Id
		@author: TrangLe
	 */
	getAdv() {
		const id = +this.route.snapshot.paramMap.get('id');
		this.advertisementService.getAdvertisement(id).subscribe(
			result => {
        	this.adv = result;
      		},
        );
	}
	goBack() {
		this.location.back();
	}
	/*
		PUT: Update Advertiment Detail
		@author: TrangLe
	 */
	EditAdv() {
		this.advertisementService.updateAdv(this.adv)
			.subscribe(() => this.router.navigate(['/advertisement-list', { message_put: this.adv.name} ]));
	}
}
