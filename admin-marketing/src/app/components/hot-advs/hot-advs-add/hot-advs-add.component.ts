import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HotAdvs } from '../../../shared/class/hot-advs';
import { HotAdvsService } from '../../../shared/services/hot-advs.service';

import { Router } from "@angular/router";

@Component({
  selector: 'app-hot-advs-add',
  templateUrl: './hot-advs-add.component.html',
  styleUrls: ['./hot-advs-add.component.css'],
  providers: [HotAdvsService]
})
export class HotAdvsAddComponent implements OnInit {

	formHotAds: FormGroup;
	hot_advs_form = new HotAdvs();
	hot_advs : HotAdvs[] = [];

    errorMessage:string = '';

  	constructor(
  		private fb: FormBuilder,
        private hotAdvsService: HotAdvsService,
        private router: Router,
  		) {}

  	ngOnInit() {
  		this.creatForm();
  	}

  	// Create form to add Hot advs
  	creatForm(): void{
        this.formHotAds = this.fb.group({
            name: [this.hot_advs_form.name, [Validators.required]],
            content: [this.hot_advs_form.content, [Validators.required]],
            image: [this.hot_advs_form.image, [Validators.required]],
            is_register: [false],
            is_view_detail: [false],
            sub_url_register: [this.hot_advs_form.sub_url_register, [Validators.required]],
            sub_url_view_detail: [this.hot_advs_form.sub_url_view_detail, [Validators.required]],
            is_draft: [false],
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

    createHotAdvs() {
        var self = this;
        let hotAdvsFormGroup = this.convertFormGroupToFormData(this.formHotAds);

        this.hotAdvsService.CreateHotAdvs(hotAdvsFormGroup).subscribe(
            (result) => {
                self.hot_advs.push(result);
                self.router.navigate(['/hot-advs-list', { message_post: this.formHotAds.value['name']} ])
            },
            (error) => {
                if(error.code == 400) {
                    self.errorMessage = error.message
                } else {
                    this.router.navigate(['/error', { message: error.message }]);
                }
                
            }
        )
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
