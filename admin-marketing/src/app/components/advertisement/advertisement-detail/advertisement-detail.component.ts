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

	@Input() adv: Advertisement;
	errorMessage: string ="";
	advForm: FormGroup;

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
		this.advertisementService.getAdvertisement(id, this.lang).subscribe(
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
			this.advertisementService.updateAdv(this.advForm.value, this.adv.id, this.lang).subscribe(
				() => {
					this.toastr.success(`Chỉnh sửa ${this.advForm.value['name']} thành công`);
					this.router.navigate(['/advertisement-list']);
				},
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
	deleteAdv(adv: Advertisement) {
    	this.advertisementService.deleteAdvById(adv.id, this.lang)
            .subscribe(
                () => {
                	this.toastr.success(`Xóa ${adv.name} thành công`);
                	this.router.navigate(['/advertisement-list']);
                },
                error =>  this.router.navigate(['/error', { message: error.json().message }])
           );
    }

	confirmDelete(adv: Advertisement) {
        bootbox.confirm({
            title: "Bạn có chắc chắn ?",
            message: "Bạn muốn xóa Quảng Cáo này",
            buttons: {
                cancel: {
                    label: "HỦY"
                },
                confirm: {
                    label: "XÓA"
                }
            },
            callback: (result)=> {
                if(result) {
                    // Check result = true. call function callback
                    this.deleteAdv(adv)
                }
            }
        });
    }
    removeMessage() {
    	this.errorMessage = '';
    }
}
