import { Component, OnInit, ViewChild } from '@angular/core';
import { Fee } from '../../../shared/class/fee';
import { FeeService } from '../../../shared/services/fee.service';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { data_config } from '../../../shared/commons/datatable_config';

declare var bootbox:any;

@Component({
  selector: 'app-fee-list',
  templateUrl: './fee-list.component.html',
  styleUrls: ['./fee-list.component.css']
})
export class FeeListComponent implements OnInit {

  constructor( private feeService: FeeService, private router: Router ) {

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
   record: string ="Phí Giao Dịch";

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
      this.router.navigate(['/error']);
		});
   }
   
   /*
    selectAll FUNCTION
    set list_id is empty
    if selectAll is check push all id to list_id
    author: Hoangnguyen
   */
   selectAll(event){
     this.list_id = []
     if(event.target.checked){
        for (var i in this.fees){
            $('#checkbox_'+this.fees[i].id).prop('checked', true);
            this.list_id.push(this.fees[i].id);
        }
     }else{
       for (var i in this.fees){
            $('#checkbox_'+this.fees[i].id).prop('checked', false);
        }
     }
   }

   /*
      triggerItem FUNCTION
      when check checkbox
      push id to list_id
      when uncheck checkbox
      remove id in list_id 
      author: Hoangnguyen
   */
    triggerItem( checked: boolean, id: any){
       if(checked){
         // when check checkbox
         this.list_id.push(id);
         // checked all fee then inout selectAll is checked
         if (this.list_id.length == this.fees.length){
           $('#selectAll').prop('checked', true);
         }

       }else{
         //when uncheck checkbox
         var index = this.list_id.indexOf(id);
         this.list_id.splice(index, 1);
         // uncheck selectAll
         let selectAll = $('#selectAll').prop('checked');
         if(selectAll){
           $('#selectAll').prop('checked', false);
         }
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
             buttons: {
              confirm: {
                  label: 'OK',
                  className: 'btn-primary'
              },
              cancel: {
                  label: 'Hủy',
                  className: 'btn-default'
              }
              },  
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
          // this.errorText = error.json().message;
          this.router.navigate(['/error']);
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
       error => {
         // this.errorText = error.json().message
          this.router.navigate(['/error']);
       }
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
       error => {
         // this.errorText = error.json().message
          this.router.navigate(['/error']);
       }
       );
   }

  ngOnInit() {
  	this.getFees();
     this.dtOptions = data_config(this.record);
  }

}
