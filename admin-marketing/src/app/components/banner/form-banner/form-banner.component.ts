import { Component,ElementRef,Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BannerService } from '../../../shared/services/banner.service';
import { Banner, positions } from '../../../shared/class/banner';

import { Router } from "@angular/router";

@Component({
  selector: 'app-form-banner',
  templateUrl: './form-banner.component.html',
  styleUrls: ['./form-banner.component.css']
})
export class FormBannerComponent implements OnInit {

	@Input() banner: Banner; // Get banner from component parent
    @Input() method; // Get type http from component parent

  	formBanner: FormGroup;

	banner_form = new Banner();
	banners: Banner[];

	positions = positions;
    isSelected = true; // Set value default selcted 
    errorMessage: String;

    
    // set inputImage property as a local variable, #inputImage on the tag input file
    @ViewChild('inputImage')
    inputImage: any;
	
  	constructor(
  		private fb: FormBuilder,
        private bannerService: BannerService,
        private router: Router,
  		) { }

  	ngOnInit() {
  		this.createForm();
  	}

  	/* 
      Create form to add banner
      @author: Trangle
    */
  	createForm() {
 		this.formBanner = this.fb.group({
            image: [this.banner_form.image, [Validators.required]],
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
    onFileChange(e) {
      if(e.target.files && e.target.files.length > 0) {
        let file = e.target.files[0];
        this.formBanner.get('image').setValue(file);
      }
    }
    /*
        Clear file upload
        @author: Trangle
     */
    clearFile() {
      this.formBanner.get('image').setValue(null);
      this.inputImage.nativeElement.value = "";
    }

    onSubmit() {
    	if (this.method = 'POST') {
    		this.bannerService.CreateBanner(this.formBanner.value)
    			.subscribe( 
    				result => this.banners = result,
    				error => this.errorMessage = <any>error
    				);
    		this.router.navigate(['/banner-list', { message_post: this.banner_form.sub_url} ])
    	}
    }

}
