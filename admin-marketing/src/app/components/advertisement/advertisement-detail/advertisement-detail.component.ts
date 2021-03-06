import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';

import { Advertisement } from '../../../shared/class/advertisement';
import { AdvertisementService } from '../../../shared/services/advertisement.service';

@Component({
  selector: 'app-advertisement-detail',
  templateUrl: './advertisement-detail.component.html',
  styleUrls: ['./advertisement-detail.component.css']
})
export class AdvertisementDetailComponent implements OnInit {
	@Input() adv: Advertisement;
	errorMessage: string ="";
	constructor(
		private advertisementService: AdvertisementService,
		private route: ActivatedRoute,
		private router: Router
		) { }

	ngOnInit() {
		this.getAdv();
	}
	/*
		GET: Get Advertiment By Id
		Call service advertiment
		@author: TrangLe
	 */
	getAdv() {
		const id = +this.route.snapshot.paramMap.get('id');
		this.advertisementService.getAdvertisement(id).subscribe(
			(result) => {
        		this.adv = result;
      		},
      		(error) => this.router.navigate(['/error', { message: error }])
        );
	}
	/*
		PUT: Update Advertiment Detail
		Call service advertiment
		@author: TrangLe
	 */
	EditAdv() {
		this.advertisementService.updateAdv(this.adv).subscribe(
			() => this.router.navigate(['/advertisement-list', { message_put: this.adv.name} ]),
			(error) => {
				if(error.status == 400) {
					this.errorMessage = error.json().name
				} else {
					this.router.navigate(['/error', { message: error.json().message }])
				}
			}
			);
	}
}
