import { Component,ElementRef,Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { BannerService } from '../../../shared/services/banner.service';
import { Banner, positions } from '../../../shared/class/banner';

@Component({
  selector: 'app-banner-add',
  templateUrl: './banner-add.component.html',
  styleUrls: ['./banner-add.component.css']
})
export class BannerAddComponent implements OnInit {
    
    banners: Banner[] =[];
    formBanner: FormGroup;
    banner_form = new Banner();
    errorMessage: string;
    positions = positions;
    isSelected = true; // Set value default selcted 
    lang: string = 'vi';


    constructor(
        private fb: FormBuilder,
        private bannerService: BannerService,
        private router: Router,
        private toastr: ToastrService,
          ) { 
        this.createForm();
    }
    ngOnInit() {
          
    }

    /* 
      Create form to add banner
      Call service Banner
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

    onSubmit() { }
        /*
        POST: Create New Advertiment
        @author: TrangLe
     */
    createBanner(){
        if(this.formBanner.invalid){
            ValidateSubmit.validateAllFormFields(this.formBanner);
        } else {
            var self = this;
            let bannerFormGroup = this.convertFormGroupToFormData(this.formBanner);

            this.bannerService.CreateBanner(bannerFormGroup, this.lang).subscribe(
                (result) => {
                    self.banners.push(result);
                    self.toastr.success(`Thêm ${this.formBanner.value['sub_url']} thành công`);
                    self.router.navigate(['/banner-list'])     
                },
                (error) =>  {
                    if( error.code == 400 ){
                        self.errorMessage = error.message
                    } else {
                        self.router.navigate(['/error', {message: error}])
                    }
                }
            );
        }
    }

    /*
        Convert form group to form data to submit form
        @author: diemnguyen
    */
    private convertFormGroupToFormData(bannerForm: FormGroup) {
        // Convert FormGroup to FormData
        let bannerValues = bannerForm.value;
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
