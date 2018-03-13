import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router } from '@angular/router';

import { Advertisement }  from '../../../shared/class/advertisement';

import { AdvertisementService } from '../../../shared/services/advertisement.service';
import { data_config } from '../../../shared/commons/datatable_config';
// Using Jquery plugins
declare var jquery:any;
declare var $ :any;

// Using bootbox plugin
declare var bootbox:any;

@Component({
    selector: 'app-advertisement-list',
    templateUrl: './advertisement-list.component.html',
    styleUrls: ['./advertisement-list.component.css']
})
export class AdvertisementListComponent implements OnInit {

	dtOptions: any = {};

	advs : Advertisement[];

	advs_delete: any; // Contains all checkbox were selected

	message_result: string = ''; // Message result
    record: string = "Quảng Cáo";
    
	// Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    /*
        Using trigger becase fetching the list of feedbacks can be quite long
        thus we ensure the data is fetched before rensering
    */ 
    dtTrigger: Subject<any> = new Subject();

    constructor(
        private advertisementService: AdvertisementService,
        private route: ActivatedRoute,
        private router: Router,
        ) {
        this.advs = [];
        this.advs_delete = [];
    }
    ngOnInit() {

        // Call dataTable 
        this.dtOptions = data_config(this.record).dtOptions;

        // Call function get all adv
        this.getAllAdvertisement();

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
        GET: Get All Advertiment To Show
        @author: TrangLe 
    */
  	getAllAdvertisement() {
  		this.advertisementService.getAllAdvertisement().subscribe(
  			(result) => {
  				this.advs = result;
  				this.dtTrigger.next();
  			},
            (error) => {
                this.router.navigate(['/error', { message: error.json().message }])
            }
        );
  	}
  	/*
      Checkbox all Adv
        Step1: Create array to contain id user to checked
        Step 2: Check checkbox all user checked
            True: Push id checked to listAdv_del, assign advs_delete = listAdv_del, message_result = ''
            False: Splice all id from array
        @author: Trangle
    */
  	checkAllAdv(event) {
        let listAdv_del = []; 
        if(event.target.checked){
            this.advs.forEach(function(element) {
                listAdv_del.push(element.id);
                $('#' + element.id).prop('checked', true);
          });
            this.advs_delete = listAdv_del;
            this.message_result = "";
        }else{
            this.advs.forEach((item, index) => {
                $('#'+item.id).prop('checked', false);
                this.advs_delete.splice(index, this.advs.length);
            });
        }
    }
    /*
        Change checkbox item
        Step : Checking checkbox item to checked
            True: Push id to advs_delete, message_result = '', 
                check length.advs_delete = users.length, checkbox all = true
            False: remove id from advs_delete, check all = false
        @author: Trangle
     */
    changeCheckboxAdv(e, adv){
        if( e.target.checked ){
            this.advs_delete.push(adv.id);
            if (this.advs_delete.length === this.advs.length) {
                $('#allAdvs').prop('checked', true);
            }
            this.message_result = "";
        } else{
            let index = this.advs_delete.indexOf(adv.id);
            this.advs_delete.splice(index, 1);

            // uncheck selectAll
            $('#allAdvs').prop('checked', false);
        }
    }

    /*
        Confirm Delete Checkbox Selected
        Using bootbox plugin
        @author: Trangle
     */
    confirmDelete() {
        /* Check advs_delete not null and length >0
            True: Show confirm and call function deleteFeedbackCheckbox 
            False: show alert
        */
        if(this.advs_delete !== null && this.advs_delete.length > 0 ){
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.advs_delete.length + " phần tử đã chọn",
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
                        this.deleteAllCheckAdvs()
                    }
                }
            });
        } else {
            bootbox.alert("Vui lòng chọn quảng cáo để xóa");
        } 
    }

    /*
        DELETE: Delete All Select Box Checked 
        Call service advertiment
        @author: Trangle  
     */
    deleteAllCheckAdvs() {
        this.advertisementService.deleteAllAdvsSelected(this.advs_delete).subscribe(
            (result) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    var self = this;
                    this.advs_delete.forEach(function(e){
                        dtInstance.rows('#delete'+e).remove().draw();
                        var item = self.advs.find(banner => banner.id == e);
                        self.advs = self.advs.filter(advs => advs !== item);
                    });
                    this.advs_delete = [];
                });
                this.message_result = "Xóa quảng cáo thành công";
            },
            (error) => {
                this.router.navigate(['/error', { message: error.json().message + error.json().fields }])
            }
        );
    }
}
