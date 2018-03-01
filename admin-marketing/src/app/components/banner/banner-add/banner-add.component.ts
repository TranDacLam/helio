import { Component,ElementRef,Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Router } from "@angular/router";

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

    // set inputImage property as a local variable, #inputImage on the tag input file
    @ViewChild('inputImage')
    inputImage: any;

    constructor(
        private fb: FormBuilder,
        private bannerService: BannerService,
        private router: Router,
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

    onSubmit() { }
        /*
        POST: Create New Advertiment
        @author: TrangLe
     */
    createBanner(formBanner){
        this.bannerService.CreateBanner( formBanner ).subscribe(
            (result) => {
                this.banners.push(result);
                this.router.navigate(['/banner-list', { message_post: formBanner.sub_url} ])     
            },
            (error) =>  this.errorMessage = <any>error
        );
    }
}
