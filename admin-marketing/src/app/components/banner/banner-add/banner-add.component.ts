import { Component,ElementRef,Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BannerService } from '../../../shared/services/banner.service';
import { Banner, positions } from '../../../shared/class/banner';

@Component({
  selector: 'app-banner-add',
  templateUrl: './banner-add.component.html',
  styleUrls: ['./banner-add.component.css']
})
export class BannerAddComponent implements OnInit {
    
    banner: Banner;
    formBanner: FormGroup;
    banner_form = new Banner();
    errorMessage: String;
    positions = positions;
    isSelected = true; // Set value default selcted 

    // set inputImage property as a local variable, #inputImage on the tag input file
    @ViewChild('inputImage')
    inputImage: any;

    constructor(
        private fb: FormBuilder,
        private bannerService: BannerService,
          ) { 
        this.createForm();
    }
    ngOnInit() {
          
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
    onSubmit() { }
}
