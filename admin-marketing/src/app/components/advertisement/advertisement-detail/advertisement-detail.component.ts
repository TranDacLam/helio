import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ToastrService } from 'ngx-toastr';

import { Advertisement } from '../../../shared/class/advertisement';
import { AdvertisementService } from '../../../shared/services/advertisement.service';

// Using bootbox 
declare var bootbox:any;

@Component({
  selector: 'app-advertisement-detail',
  templateUrl: './advertisement-detail.component.html',
  styleUrls: ['./advertisement-detail.component.css']
})
export class AdvertisementDetailComponent implements OnInit {

	adv: Advertisement;
	method = 'PUT';
	title = 'Chỉnh Sửa Quảng Cáo';

	lang: string = 'vi';

	constructor(
		private advertisementService: AdvertisementService,
		private route: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder,
		private toastr: ToastrService,
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
		this.advertisementService.getAdvertisement(id, this.lang).subscribe(
			(result) => {
        		this.adv = result;
        		// this.createForm();
      		},
      		(error) => this.router.navigate(['/error', { message: error }])
        );
	}
}
