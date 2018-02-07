import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { Banner } from '../../../shared/class/banner';
import { BannerService } from '../../../shared/services/banner.service';

@Component({
  selector: 'app-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.css']
})
export class BannerListComponent implements OnInit {

	dtOptions: any = {};
	banners: Banner[];

	banner_del: any;
    message_success: string = ""; // Display message success
    message_error: string = ""; // Display message error
    message_result: string = ""; // Display message result
    errorMessage: String;

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;


    // Using trigger becase fetching the list of feedbacks can be quite long
	// thus we ensure the data is fetched before rensering
	dtTrigger: Subject<any> = new Subject();

  	constructor(
  		private route: ActivatedRoute,
      private bannerService: BannerService
  		) { 
  		this.banner_del = [];
      	this.banners = [];
  	}

  	ngOnInit() {
  		this.dtOptions = {
          language: {
            sSearch: '',
            searchPlaceholder: ' Nhập thông tin tìm kiếm',
            lengthMenu: 'Hiển thị _MENU_ Banner',
            info: "Hiển thị _START_ tới _END_ của _TOTAL_ Banner",
            paginate: {
            "first":      "Đầu",
            "last":       "Cuối",
            "next":       "Sau",
            "previous":   "Trước"
          },
          select: {
            rows: ''
          },
          sInfoFiltered: "",
          zeroRecords: 'Không có Banner nào để hiển thị',
          infoEmpty: ""
          },
          responsive: true,
          pagingType: "full_numbers",
        };
        this.getAllBanners();
  	}

  	isAllChecked() {
  		// return this.banners.every(_ => _.position);
  	}

  	checkAllBanner(ev) {
      // console.log(ev.target.checked);
  		this.banners.forEach(x => x.position = ev.target.checked)
  	}

  	getAllBanners() {
      this.bannerService.getAllBanner().subscribe(
        result => {
          this.banners = result;
          this.dtTrigger.next(); },
        error =>  this.errorMessage = <any>error
          )
  	}

}
