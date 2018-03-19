import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Banner, positions } from '../../../shared/class/banner';
import { BannerService } from '../../../shared/services/banner.service';

import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { env } from '../../../../environments/environment';

@Component({
  selector: 'app-banner-detail',
  templateUrl: './banner-detail.component.html',
  styleUrls: ['./banner-detail.component.css']
})
export class BannerDetailComponent implements OnInit {

	banner: Banner;
    formBanner: FormGroup;
    banner_form = new Banner();
	errorMessage: String;
    positions = positions;
    api_domain:string = "";

    lang: string = 'vi';

  	constructor( 
  		private bannerService: BannerService,
  		private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
  	) {
        this.createForm();
        this.api_domain = env.api_domain_root;
       }

  	ngOnInit() {
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
  		this.getBannerById();
  	}

      /* 
      Create form to add banner
      @author: Trangle
    */
    createForm() {
        this.formBanner = this.fb.group({
            image: [this.banner_form.image],
            sub_url: [this.banner_form.sub_url, [Validators.required]],
            position: [this.banner_form.position, [Validators.required]],
            is_show: [false]
        });
    }

  	/*
  		Get Banner By Id
  		Call api form banner.services
  		@author: TrangLe
  	 */
  	getBannerById() {
  		const id = +this.route.snapshot.paramMap.get('id');
    	this.bannerService.getBannerById(id, this.lang)
    	.subscribe(
        	(banner) => {
                this.banner = banner;
            },
        	(error) =>  {
                this.router.navigate(['/error', { message: error }]);
            }
        );
  	}

    /*
        Upload image
        FileReader: reading file contents
        @author: TrangLe
    */
    onFileChange(event) {
        let reader = new FileReader();
        let input_id = $(event.target).attr('id');
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formBanner.get(input_id).setValue({ filename: file.name, filetype: file.type, value: file });
        }
    }
    onSubmit() {
        if(this.formBanner.invalid){
            ValidateSubmit.validateAllFormFields(this.formBanner);
        } else {
            var self = this;
            let bannerFormGroup = this.convertFormGroupToFormData(this.formBanner);
            this.bannerService.updateBanner(bannerFormGroup, this.banner.id, this.lang).subscribe(
                    (data) => {
                        // Navigate to promotion page where success
                        this.router.navigate(['/banner-list', { message_put: this.formBanner.value['sub_url']} ])
                    }, 
                    (error) => {
                        if(error.code == 400) {
                            this.errorMessage = error.message
                        } else {
                           self.router.navigate(['/error', { message: error.message }]);
                    }
                }
            );
        }
    }

    /*
        Convert form group to form data to submit form
        @author: diemnguyen
    */
    private convertFormGroupToFormData(formBanner: FormGroup) {
        // Convert FormGroup to FormData
        let bannerValues = formBanner.value;
        let bannerFormData:FormData = new FormData(); 
        if (bannerValues){
            /* 
                Loop to set value to formData
                Case1: if value is null then set ""
                Case2: If key is image field then set value have both file and name
                Else: Set value default
            */
            Object.keys(bannerValues).forEach(k => { 
                if(bannerValues[k] == null) {
                    bannerFormData.append(k, '');
                } else if (k === 'image') {
                    bannerFormData.append(k, bannerValues[k].value, bannerValues[k].name);
                } else {
                    bannerFormData.append(k, bannerValues[k]);
                }
            });
        }
        return bannerFormData;
    }
}
