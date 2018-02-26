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
    isChecked = false;
    message_success: string = ""; // Display message success
    message_error: string = ""; // Display message error
    message_result: string = ""; // Display message result
    errorMessage: String;
    checkAll= false;

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
        /*
            Customize: DataTable
            @author: TrangLe
         */
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
    /*
        Function: Select All Banner
        @author: TrangLe
     */
    checkAllBanner(event) {
        let arr_del = []; 
        if(event.target.checked){
            this.banners.forEach(function(element) {
                arr_del.push(element.id);
            });
            this.banner_del = arr_del;
            this.isChecked = true;
            this.message_error = "";
            this.message_result = "";
        }else{
            this.isChecked = false;
            this.banners.forEach((item, index) => {
                this.banner_del.splice(index, this.banners.length);
            });
        }
    }

    /*
        GET: Get All Banner
        @author: TrangLe
     */
    getAllBanners() {
        this.bannerService.getAllBanner().subscribe(
            result => {
                this.banners = result;
                this.dtTrigger.next(); },
                error =>  this.errorMessage = <any>error
                )
    }
    checkItemChange(event, banner) {
        if(event.target.checked){
            this.banner_del.push(banner.id);
            this.message_error = "";
            this.message_result = "";
        }
        else{
            let updateBannerItem = this.banner_del.find(this.findIndexToUpdate, banner.id);

            let index = this.banner_del.indexOf(updateBannerItem);

            this.banner_del.splice(index, 1);
        }
    }
    findIndexToUpdate(type) { 
        return type.id === this;
    }

    deleteBannersCheckbox() {
        if (this.banner_del !== null) { 
            if( this.banner_del.length == 0) {
                this.message_error = "Vui lòng chọn feedback để xóa";
                this.message_result = "";
                this.message_success = "";
        } else {
            this.bannerService.deleteBannerSelected(this.banner_del).subscribe(
            (data) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    this.banner_del.forEach(function(element) {
                        dtInstance.rows('#delete'+element).remove().draw();
                    });
                    this.banner_del = [];
                });
                this.message_success = "Xóa banner thành công";
            },
            (error) =>  this.errorMessage = <any>error
            );
            }  
        }
    }
}
