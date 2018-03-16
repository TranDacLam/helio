import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';

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
	advForm: FormGroup;

	constructor(
		private advertisementService: AdvertisementService,
		private route: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder,
		) { }

	ngOnInit() {
		this.getAdv();
	}

	createForm() {
        this.advForm = this.fb.group({
          name: [this.adv.name, [Validators.required, Validators.maxLength(255)]],
          is_show: [this.adv.is_show]
        });
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
        		this.createForm();
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
		if (this.advForm.invalid) {
			ValidateSubmit.validateAllFormFields(this.advForm);
		} else {
			this.advertisementService.updateAdv(this.advForm.value, this.adv.id).subscribe(
				() => this.router.navigate(['/advertisement-list', { message_put: this.advForm.value['name']} ]),
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
}
