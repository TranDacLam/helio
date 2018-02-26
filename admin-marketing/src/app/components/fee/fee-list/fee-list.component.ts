import { Component, OnInit, ViewChild } from '@angular/core';
import { Fee } from '../../../shared/class/fee';
import { FeeService } from '../../../shared/services/fee.service';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-fee-list',
  templateUrl: './fee-list.component.html',
  styleUrls: ['./fee-list.component.css']
})
export class FeeListComponent implements OnInit {

  constructor( private feeService: FeeService ) {

   }
   @ViewChild(DataTableDirective)
   dtElement: DataTableDirective;
   dtOptions: DataTables.Settings = {};
   // data for datatable render
   fees: Fee[];
   // text error
   errorText: string;
   // list consist of id to delete list 
   list_id = [];

   // action when hover
   hoverIn(fee){
     fee.isHover = true;
   }
    hoverOut(fee){
     fee.isHover = false;
   }

   // when get data, set value for fees, trigger data table
   getFees(){
   	return this.feeService.getFees().subscribe(
   		success => {
        this.errorText = null;
   			this.fees = success; 
   		},
		error => {
			this.errorText = error.statusText;
		});
   }
   
   /*
    for loop in fees, call triggerItem
   */
   selectAll(event){
     if(event.target.checked){
        for (var i in this.fees){
            this.triggerItem(true, this.fees[i].id);
            this.fees[i].selected = true;
        }

     }else{
       for (var i in this.fees){
          this.triggerItem(false, this.fees[i].id);
          this.fees[i].selected = false;
        }
     }
   }

   /*
      when check checkbox
      check id exist in list_id ( avoid duplicate when select all) 
          if false add id to list_id, if true, no add
      when uncheck checkbox
      remove id in list_id 
   */
    triggerItem( checked: boolean, id: any){
       if(checked){
         var fee = this.list_id.find( item => item == id);
         if (fee){
             return false;
         }
         this.list_id.push(id);
       }else{
         var index = this.list_id.indexOf(id);
         this.list_id.splice(index, 1);
       }
    }
    /*
      part 1:
         delete fee in this.fees
      part 2:
         delete row in datatable
         set list_id empty
    */

   deleteFee(){
     // check list_id exist
     if( this.list_id.length == 0 ){
       this.errorText = 'Chưa chọn phí nào để xóa.';
       return false;
     }
     this.feeService.deleteListFee(this.list_id).subscribe( 
       (success) => {
             for (var item in this.list_id){
                this.fees = this.fees.filter( fee => fee.id !== this.list_id[item]  );
            }
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                this.list_id.forEach(function(item){
                      dtInstance.rows('#'+item).remove().draw();
                });
               this.list_id = []
            });
         },
       error =>{
        this.errorText = error.json().message;
      });
   }
   
   /*
      find fee which clicked
      for item in fees
        if item is apply and same position with found fee, cancel apply
      set found fee is apply

   */
   apply_fee(id: number){
     
     this.feeService.applyFee(id).subscribe(
       success => {
           this.errorText = null;
           var fee = this.fees.find( fee => fee.id == id);
           this.fees.filter( item =>{ 
             if(item.is_apply == true && item.position == fee.position) 
               item.is_apply = false;  
           });
          fee.is_apply = true;
       },
       error => this.errorText = error.json().message
       );
   }

   /*
      cancel appply fee
   */
   cancel_apply_fee(id: number){
     this.feeService.applyFee(id).subscribe(
       success => {
          this.errorText = null;
          var fee = this.fees.find( fee => fee.id == id);
          if(fee.is_apply){
            fee.is_apply = false;
          }
       },
       error => this.errorText = error.json().message
       );
   }

  ngOnInit() {
  	this.getFees();
  	this.dtOptions = {
      language: {
            search: 'Tìm kiếm',
            searchPlaceholder: ' Nhập thông tin tìm kiếm',
            lengthMenu: 'Hiển thị _MENU_ Phí Giao Dịch',
            info: "Hiển thị _START_ tới _END_ của _TOTAL_ Phí",
            paginate: {
            "first":      "Đầu",
            "last":       "Cuối",
            "next":       "Sau",
            "previous":   "Trước"
          },
          zeroRecords: 'Không có phản hồi nào để hiển thị',
          infoEmpty: ""
          },
    };
  }

}
