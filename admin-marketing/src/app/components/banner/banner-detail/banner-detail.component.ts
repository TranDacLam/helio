import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Banner } from '../../../shared/class/banner';
import { BannerService } from '../../../shared/services/banner.service';

@Component({
  selector: 'app-banner-detail',
  templateUrl: './banner-detail.component.html',
  styleUrls: ['./banner-detail.component.css']
})
export class BannerDetailComponent implements OnInit {

	banner: Banner;
	method: 'PUT'; // type method from form-banner component 
	errorMessage: String;

  	constructor( 
  		private bannerService: BannerService,
  		private route: ActivatedRoute
  	) { }

  	ngOnInit() {
  		this.getBannerById();
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

}
