import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';

import { Advertisement }  from '../../../shared/class/advertisement';

import { AdvertisementService } from '../../../shared/services/advertisement.service';

// Using Jquery plugins
declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'app-advertisement-list',
    templateUrl: './advertisement-list.component.html',
    styleUrls: ['./advertisement-list.component.css']
})
export class AdvertisementListComponent implements OnInit {

	dtOptions: any = {};
	advs : Advertisement[];
	advs_delete: any; // Contains all checkbox were selected
	isChecked = false; // Default value chekbox
	message_success: string = ""; // Display message success
	message_result = ''; // Message result

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
        private route: ActivatedRoute
        ) {
        this.advs = [];
        this.advs_delete = [];
    }
    ngOnInit() {
        /*
            Customize: Customize DataTable
            @author: TrangLe
         */
        this.dtOptions = {
            columnDefs: [{
                'className': 'dt-body-center',
                'render': function (data, type, full, meta){
                    return '<input type="checkbox" name="id[]" value="' 
                      + $('<div/>').text(data).html() + '">';
                    }
                }],
                language: {
                    sSearch: '',
                    searchPlaceholder: ' Nhập thông tin tìm kiếm',
                    lengthMenu: 'Hiển thị _MENU_ Quảng cáo',
                    info: "Hiển thị _START_ tới _END_ của _TOTAL_ Quảng cáo",
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
                    zeroRecords: 'Không có Quảng cáo nào để hiển thị',
                    infoEmpty: ""
               },
                responsive: true,
                pagingType: "full_numbers",
            };
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
  			result => {
  				this.advs = result;
  				this.dtTrigger.next();
  			});
  	}
  	/*
      Function: Select all checkbox
      @author: TrangLe
    */
  	checkAllAdv(event) {
        let listAdv_del = []; 
            if(event.target.checked){
                this.advs.forEach(function(element) {
                    listAdv_del.push(element.id);
              });
                this.advs_delete = listAdv_del;
                this.isChecked = true;
                this.message_success = "";
                this.message_result = "";
            }else{
                this.isChecked = false;
                this.advs.forEach((item, index) => {
                this.advs_delete.splice(index, this.advs.length);
            });
        }
    }
    /*
        Function: Select each item checkbox
        @author: Trangle
     */
    changeCheckboxAdv(e, adv){
        if( e.target.checked ){
            this.advs_delete.push(adv.id);
            this.message_success = "";
            this.message_result = "";
        } else{
            let updateAdvItem = this.advs_delete.find(this.findIndexToUpdate, adv.id);

            let index = this.advs_delete.indexOf(updateAdvItem);

            this.advs_delete.splice(index, 1);
        }
    }
    findIndexToUpdate(type) { 
        return type.id === this;
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
     */
    deleteAllCheckAdvs() {
        this.advertisementService.deleteAllAdvsSelected(this.advs_delete).subscribe(
            result => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    this.advs_delete.forEach(function(e){
                        dtInstance.rows('#delete'+e).remove().draw();
                    });
                    this.advs_delete = [];
                });
                this.message_success = "Xóa quảng cáo thành công";
            });
    }
}
