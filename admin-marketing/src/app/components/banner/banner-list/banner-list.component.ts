import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { ToastrService } from 'ngx-toastr';

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

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    dtOptions: any = {};

    banners: Banner[];

    length_all: Number = 0;
    length_selected: Number = 0;

    errorMessage: string; // Show error from server
    lang: string = 'vi';

    record: string ="Banner";


     // Using trigger becase fetching the list of banners can be quite long
	// thus we ensure the data is fetched before rensering
	// dtTrigger: Subject<any> = new Subject();

     constructor(
        private route: ActivatedRoute,
        private bannerService: BannerService,
        private router: Router,
        private toastr: ToastrService,
        ) { 
        this.banners = [];
     }

    ngOnInit() {
        // Call dataTable
        this.dtOptions = data_config(this.record);
        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
            },
            columnDefs: [
                {
                    targets: 1,
                    visible: false
                },
                { 
                    orderable: false, 
                    targets: 0 
                }
            ]
        };
        this.dtOptions = {...this.dtOptions, ...dt_options_custom };
        // Call function getAllBanners()
        this.getAllBanners();
    }
    /*
        Event select checbox on row
            Case1: all row are checked then checkbox all on header is checked
            Case1: any row is not checked then checkbox all on header is not checked
        @author: TrangLe 
    */
    selectCheckbox(event) {   
        $(event.target).closest( "tr" ).toggleClass( "selected" );
        this.getLengthSelected();
        this.checkSelectAllCheckbox();
    }

    // input checkall checked/unchecked
    checkSelectAllCheckbox() {
        if($('#table_id tbody tr').hasClass('selected')){
            $('#select-all').prop('checked', $("#table_id tr.row-data:not(.selected)").length == 0);
        }else{
            $('#select-all').prop('checked', false);
        }
        this.getLengthSelected();
    }
    /*
        Event select All Button on header table
        @author: TrangLe 
    */
    selectAllEvent(event) {
        if( event.target.checked ) {
            $("#table_id tr").addClass('selected');
        } else {
            $("#table_id tr").removeClass('selected');
        }
        $("#table_id tr input:checkbox").prop('checked', event.target.checked);
        this.getLengthSelected();
    }

    /*
        Function getLengthSelected(): draw length selected
        @author: TrangLe
    */
    getLengthSelected(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            this.length_selected = dtInstance.rows('.selected').count();
        })
    }
    /*
        GET: Get All Banner
        Call service banner
        @author: TrangLe
     */
    getAllBanners() {
        this.banners = null;
        this.bannerService.getAllBanner(this.lang).subscribe(
            (result) => {
                this.banners = result;
                // this.dtTrigger.next();
                this.length_all = this.banners.length;
            },
            (error) => {
                this.router.navigate(['/error', { message: error.json().message }])
            }
        )
    };


    confirmDelete() {
        /* Check banner_del not null and length >0
            True: Show confirm and call function deleteFeedbackCheckbox 
            False: show alert
        */
        if(this.length_selected > 0 ){
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.length_selected + " banner đã chọn",
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
            this.toastr.warning(`Vui lòng chọn banner để xóa`);
        } 
    }
    /*
        Function: Delete All Banner Selected
        @author: TrangLe
     */
     deleteBannersCheckbox() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list promotion id selected
            let get_list_id = dtInstance.cells('.selected', 1).data().toArray();
            // array string to array number
            let list_id_selected = get_list_id.map(Number);

            // Call API remove list promotion selected
            this.bannerService.deleteBannerSelected(list_id_selected, this.lang).subscribe(
                (data) => {
                    this.toastr.success(`Xóa ${this.length_selected} banner thành công`);

                    // Remove all promotion selected on UI
                    dtInstance.rows('.selected').remove().draw();
                    // Reset count promotion
                    this.length_all =  dtInstance.rows().count();
                    this.length_selected = 0;
                },
                (error) => {
                    this.router.navigate(['/error', { message: error.json().message + error.json().fields }])
                });
            }); 
    }

     /*
        Function changeLangVI(): Change language and callback service getEvents()
        Author: Lam
    */
    changeLangVI(){
        if(this.lang === 'en'){
            $('.custom_table').attr('style', 'height: 640px');
            this.lang = 'vi';
            this.banners = null;
            this.getAllBanners();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }

    /*
        Function changeLangEN(): Change language and callback service getEvents()
        Author: Lam
    */
    changeLangEN(){
        if(this.lang === 'vi'){
            $('.custom_table').attr('style', 'height: 640px');
            this.lang = 'en';
            this.banners=null;
            this.getAllBanners();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }
  
}
