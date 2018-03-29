import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HotAdvs } from '../../../shared/class/hot-advs';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { HotAdvsService } from '../../../shared/services/hot-advs.service';
import { ToastrService } from 'ngx-toastr';
import * as ckeditor_config from './../../../shared/commons/ckeditor_config';

import { Router } from "@angular/router";

@Component({
  selector: 'app-hot-advs-add',
  templateUrl: './hot-advs-add.component.html',
  styleUrls: ['./hot-advs-add.component.css'],
  providers: [HotAdvsService]
})
export class HotAdvsAddComponent implements OnInit {

	formHotAds: FormGroup;
	hot_ads : HotAdvs;

    errorMessage:string = '';

    ckEditorConfig:any;
    title: string ="";

  	constructor(
  		private fb: FormBuilder,
        private hotAdvsService: HotAdvsService,
        private router: Router,
        private toastr: ToastrService,
  		) {}

  	ngOnInit() {
        this.title = "Thêm Hot Ads";
        this.hot_ads = new HotAdvs()
  		this.creatForm();
        this.ckEditorConfig = ckeditor_config.config;
  	}

  	// Create form to add Hot advs
  	creatForm(): void{
        this.formHotAds = this.fb.group({
            name: [this.hot_ads.name, [Validators.required, Validators.maxLength(255)]],
            content: [this.hot_ads.content, [Validators.required]],
            image: [this.hot_ads.image],
            is_register: [this.hot_ads.is_register === true ? true : false],
            is_view_detail: [this.hot_ads.is_register === true ? true : false],
            sub_url_register: [this.hot_ads.sub_url_register],
            sub_url_view_detail: [this.hot_ads.sub_url_view_detail],
            is_draft: [this.hot_ads.is_draft === true ? true : false],
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
            this.formHotAds.get(input_id).setValue({ filename: file.name, filetype: file.type, value: file });
        }
    }

    onSubmit() {
        var self = this;
        let hotAdvsFormGroup = this.convertFormGroupToFormData(this.formHotAds);
        if( this.formHotAds.invalid) {
            $(window).scrollTop(0);
            ValidateSubmit.validateAllFormFields(this.formHotAds);
        } else {
            this.hotAdvsService.CreateHotAdvs(hotAdvsFormGroup).subscribe(
                (result) => {
                    this.toastr.success(`Thêm ${this.formHotAds.value['name']} banner thành công`);
                    self.router.navigate(['/hot-advs-list'])
                },
                (error) => {
                    if(error.code == 400) {
                        $(window).scrollTop(0);
                        self.errorMessage = error.message
                    } else {
                        this.router.navigate(['/error', { message: error.message }]);
                    }
                    
                }
            )
        }
    }
    /*
        Convert form group to form data to submit form
        @author: diemnguyen
    */
    private convertFormGroupToFormData(hotAdvsForm: FormGroup) {
        // Convert FormGroup to FormData
        let hotAdvsValues = hotAdvsForm.value;
        let hotAdvsFormData:FormData = new FormData(); 
        if (hotAdvsValues){
            /* 
                Loop to set value to formData
                Case1: if value is null then set ""
                Case2: If key is image field then set value have both file and name
                Else: Set value default
            */
            Object.keys(hotAdvsValues).forEach(k => { 
                if(hotAdvsValues[k] == null) {
                    hotAdvsFormData.append(k, '');
                } else if (k === 'image') {
                    hotAdvsFormData.append(k, hotAdvsValues[k].value, hotAdvsValues[k].name);
                } else {
                    hotAdvsFormData.append(k, hotAdvsValues[k]);
                }
            });
        }
        return hotAdvsFormData;
    }
    
    removeErrorMessage() {
        this.errorMessage = '';
    }
}
