import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';

import { Banner } from '../../../shared/class/banner';
import { BannerService } from '../../../shared/services/banner.service';
import { data_config } from '../../../shared/commons/datatable_config';

declare var bootbox:any;

@Component({
    selector: 'app-banner-list',
    templateUrl: './banner-list.component.html',
    styleUrls: ['./banner-list.component.css']
})
export class BannerListComponent implements OnInit {

    dtOptions: any = {};

    banners: Banner[];

    banner_del: any;

    checkbox:boolean = false;
    message_result: string = ""; // Display message result
    errorMessage: string; // Show error from server
    record: string ="Banner";

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;


     // Using trigger becase fetching the list of banners can be quite long
	// thus we ensure the data is fetched before rensering
	dtTrigger: Subject<any> = new Subject();

     constructor(
        private route: ActivatedRoute,
        private bannerService: BannerService,
        private router: Router,
        ) { 
        this.banner_del = [];
        this.banners = [];
     }

    ngOnInit() {
        // Call dataTable
        this.dtOptions = data_config(this.record).dtOptions;
        // Call function getAllBanners()
        this.getAllBanners();

          this.route.params.subscribe(params => {
               if( params.message_post ){
                    this.message_result = " Thêm "+ params.message_post + " thành công.";
               } else if ( params.message_put ) {
                    this.message_result = "  Chỉnh sửa  "+ params.message_put + " thành công.";
               } else {
                    this.message_result = "";
               }
          });
     }

    /*
        GET: Get All Banner
        Call service banner
        @author: TrangLe
     */
     getAllBanners() {
        this.bannerService.getAllBanner().subscribe(
            (result) => {
                this.banners = result;
                this.dtTrigger.next(); 
            },
            (error) => {
                this.router.navigate(['/error', { message: error.json().message }])
            }
        )};

    /*
        Function: Select All Banner
        Step: Create array to save id checked
            Checking all checked
            True: push id to array, item checkbox = True, message_result = ''
            False: Remove all id from banner_del, item checkbox = False
        @author: TrangLe
     */
    checkAllBanner(event) {
        let arr_del = []; 
        if(event.target.checked){
            this.banners.forEach(function(element) {
                arr_del.push(element.id);
                // $('#' + element.id).prop('checked', true);
            });
            this.checkbox = true;
            this.banner_del = arr_del;
            this.message_result = "";
        }else{
            this.checkbox = false;
            this.banners.forEach((item, index) => {
                // $('#'+ item.id).prop('checked', false);
                this.banner_del.splice(index, this.banners.length);
            });
        }
    }

    /*
        Function: Check each item checkbox
        Check item checkbox is checked
            True: push id in array, if banner_del.lenght = banners.length -> all checkbox = true
            False: remove id in array, all checkbox = false
        @author: Trangle
     */
    checkItemChange(event, banner) {
        if(event.target.checked){
            this.banner_del.push(banner.id);
            if(this.banner_del.length == this.banners.length) {
                $('#allCheck').prop('checked', true);
            }
            this.message_result = "";
        }
        else{
            let index = this.banner_del.indexOf(banner.id);
            this.banner_del.splice(index, 1);

            $('#allCheck').prop('checked', false);
        }
    }
    
    confirmDelete() {
        /* Check banner_del not null and length >0
            True: Show confirm and call function deleteFeedbackCheckbox 
            False: show alert
        */
        if(this.banner_del !== null && this.banner_del.length > 0 ){
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.banner_del.length + " phần tử đã chọn",
                buttons: {
                    confirm: {
                        label: 'Xóa',
                        className: 'btn-success',
                    },
                    cancel: {
                        label: 'Hủy',
                        className: 'pull-left btn-danger',
                    }
                },
                callback: (result)=> {
                    if(result) {
                        // Check result = true. call function
                        this.deleteBannersCheckbox()
                    }
                }
            });
        } else {
            bootbox.alert("Vui lòng chọn banner để xóa");
        } 
    }
    /*
        Function: Delete All Banner Selected
        @author: TrangLe
     */
     deleteBannersCheckbox() {
        this.bannerService.deleteBannerSelected(this.banner_del).subscribe(
          (data) => {
               this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    var self = this;
                    this.banner_del.forEach(function(element) {
                        dtInstance.rows('#delete'+element).remove().draw();
                        var banner_item = self.banners.find(banner => banner.id == element);
                        self.banners = self.banners.filter(banners => banners !== banner_item);
                    });
                    this.banner_del = [];
               });
               this.message_result = "Xóa banner thành công";
          },
          (error) => {
               this.router.navigate(['/error', { message: error.json().message + error.json().fields }])
               }
          );  
     }  
}
