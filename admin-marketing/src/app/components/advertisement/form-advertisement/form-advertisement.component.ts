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
  selector: 'app-form-advertisement',
  templateUrl: './form-advertisement.component.html',
  styleUrls: ['./form-advertisement.component.css']
})
export class FormAdvertisementComponent implements OnInit {

  	adv: Advertisement;

	errorMessage: string ="";
	advForm: FormGroup;

	lang: string = 'vi';
	title: string= "";

	constructor(
		private advertisementService: AdvertisementService,
		private route: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder,
		private toastr: ToastrService,
		) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
        if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title = "Chỉnh Sửa Quảng Cáo";
            this.getAdv();
        } else {
            // Add new Form
            this.title = "Thêm Quảng Cáo";
            this.adv = new Advertisement()
            this.createForm();
        }
	}

	createForm() {
        this.advForm = this.fb.group({
          name: [this.adv.name, [Validators.required, Validators.maxLength(255)]],
          is_show: [this.adv.is_show === true ? true : false],
        });
    }

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
	onSubmit() {
		if (this.advForm.invalid) {
			ValidateSubmit.validateAllFormFields(this.advForm);
		} else {
			if (this.adv.id) {
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
			} else{
				this.advertisementService.addAdvertisement( this.advForm.value, this.lang ).subscribe(
	    			(resultAdv) => {
	    				// this.advs.push(resultAdv);
	                    this.toastr.success(`Thêm ${this.advForm.value['name']} thành công`);
	                    this.router.navigate(['/advertisement-list'])
	    			},
	                (error) => {
	                    if (error.status == 400 ) {
	                        this.errorMessage = error.json()
	                    } else {
	                        this.router.navigate(['/error', { message: error.json().message }])
	                    }
	                }
	            );
			}
			
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
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Quảng Cáo này?",
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
