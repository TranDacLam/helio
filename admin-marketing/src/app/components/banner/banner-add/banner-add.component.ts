import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Banner, positions } from '../../../shared/class/banner';

@Component({
  selector: 'app-banner-add',
  templateUrl: './banner-add.component.html',
  styleUrls: ['./banner-add.component.css']
})
export class BannerAddComponent implements OnInit {

	formBanner: FormGroup;
	banner_form = new Banner();
	banners: Banner[];
	positions = positions

	@ViewChild('fileInput') fileInput: ElementRef;
	
  	constructor(
  		private fb: FormBuilder
  		) { }

  	ngOnInit() {
  		this.createForm();
  	}

  	// Create form to add banner
  	createForm() {
 		this.formBanner = this.fb.group({
            image: [this.banner_form.image, [Validators.required]],
            sub_url: [this.banner_form.sub_url, [Validators.required]],
            position: [this.banner_form.position, [Validators.required]],
            is_show: [this.banner_form.is_show]
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
          this.formBanner.get('image').setValue(file)
        };
      }
    }
    // Clear file 
    clearFile() {
      this.formBanner.get('image').setValue(null);
      this.fileInput.nativeElement.value = '';
    }
}
