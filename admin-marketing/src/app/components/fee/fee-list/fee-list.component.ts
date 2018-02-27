import { Component, OnInit, ViewChild } from '@angular/core';
import { Fee } from '../../../shared/class/fee';
import { FeeService } from '../../../shared/services/fee.service';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';

declare var bootbox:any;

@Component({
  selector: 'app-fee-list',
  templateUrl: './fee-list.component.html',
  styleUrls: ['./fee-list.component.css']
})
export class FeeListComponent implements OnInit {

  constructor( private feeService: FeeService ) {

   }

  // author: Hoangnguyen

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
    selectAll FUNCTION
    for loop in fees, call triggerItem to add id to list_id
    author: Hoangnguyen
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
      triggerItem FUNCTION
      when check checkbox
      check id exist in list_id ( avoid duplicate when select all) 
          if false add id to list_id, if true, no add
      when uncheck checkbox
      remove id in list_id 
      author: Hoangnguyen
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
      confirm_delete FUNCTION
      if list_id exist show popup confirm
      else show popup alert
      author: Hoangnguyen
    */
    confirm_delete(){
      let self = this;
      if( this.list_id.length > 0 ){
          bootbox.confirm({ 
            title: "Bạn có chắc chắn",
            message: "Bạn muốn xóa " + this.list_id.length + " phần tử đã chọn",
            callback: function(result){ 
              /* result is a boolean; true = OK, false = Cancel*/
              if (result){
                self.deleteFee();
              }
            }
          })
      }else{
          bootbox.alert("Vui lòng chọn phần tử cần xóa");
      }
    }
    /*
      deleteFee FUNCTION
      part 1:
         delete fee in this.fees
      part 2:
         delete row in datatable
         set list_id empty
      author: Hoangnguyen
    */
     deleteFee(){
       this.feeService.deleteListFee(this.list_id).subscribe( 
         (success) => {
              let self = this;
              this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  this.list_id.forEach(function(item){
                      // delete fee in this.fees
                      self.fees = self.fees.filter( fee => fee.id !== item  );
                      // delete row in datatable
                      dtInstance.rows('#'+item).remove().draw();
                  });
                 this.list_id = []
              });
           },
         error =>{
          this.errorText = error.json().message;
        });
       return true;
     }
   
   /*
      apply_fee FUNCTION
      find fee which clicked
      for item in fees
        if item is apply and same position with found fee, cancel apply
      set found fee is apply
      author: Hoangnguyen

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
      cancel_apply_fee FUNCTION
      cancel appply fee
      author: Hoangnguyen
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
