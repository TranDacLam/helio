import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HotAdvs } from '../../../shared/class/hot-advs';

@Component({
  selector: 'app-hot-advs-add',
  templateUrl: './hot-advs-add.component.html',
  styleUrls: ['./hot-advs-add.component.css']
})
export class HotAdvsAddComponent implements OnInit {

	formHotAds: FormGroup;
	hot_advs_form = new HotAdvs();
	hot_advs : HotAdvs [];

	@ViewChild('fileInput') fileInput: ElementRef;

  	constructor(
  		private fb: FormBuilder
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
            check_res: [false],
            check_detail: [false],
            sub_url_res: [this.hot_advs_form.sub_url_res],
            sub_url_detail: [this.hot_advs_form.sub_url_detail],
            is_draft: [false],
        });
    }

    // upload image 
    // FileReader: reading file contents
    onFileChange(e) {
    	let reader = new FileReader();
    	if(e.target.files && e.target.files.length > 0) {
    		let file = e.target.files[0];
    		reader.readAsDataURL(file);
    		reader.onload = () => {
    			this.formHotAds.get('image').setValue(file)
    		};
    	}
    }
    // Clear file 
    clearFile() {
    	this.formHotAds.get('image').setValue(null);
    	this.fileInput.nativeElement.value = '';
    }
}
