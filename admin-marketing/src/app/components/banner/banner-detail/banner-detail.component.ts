import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Banner, positions } from '../../../shared/class/banner';
import { BannerService } from '../../../shared/services/banner.service';

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
    // set inputImage property as a local variable, #inputImage on the tag input file
    @ViewChild('inputImage')
    inputImage: any;

  	constructor( 
  		private bannerService: BannerService,
  		private route: ActivatedRoute,
        private fb: FormBuilder,
  	) {
        this.createForm();
       }

  	ngOnInit() {
  		this.getBannerById();
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
  		Get Banner By Id
  		Call api form banner.services
  		@author: TrangLe
  	 */
  	getBannerById() {
  		const id = +this.route.snapshot.paramMap.get('id');
    	this.bannerService.getBannerById(id)
    	.subscribe(
        	banner => this.banner = banner,
        	error =>  this.errorMessage = <any>error
        );
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

}
