import { Component, OnInit } from '@angular/core';
import { Fee } from '../../../shared/class/fee';
import { FeeService } from '../../../shared/services/fee.service';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-fee-list',
  templateUrl: './fee-list.component.html',
  styleUrls: ['./fee-list.component.css']
})
export class FeeListComponent implements OnInit {

  constructor( private feeService: FeeService) {

   }
   fees: Fee[];
   // fee: Fee;
   errorText: string;
   dtTrigger: Subject<any> = new Subject();
   dtOptions: DataTables.Settings = {};
   list_id = [];



   // when get data, set value for fees, trigger data table
   getFees(){
   	return this.feeService.getFees().subscribe(
   		result => {
   			this.fees = result; 
   			this.dtTrigger.next();
   		},
		error => {
			this.errorText = error.statusText;
		});
   }
   
   selectAll(event){
     if(event.target.checked){
        for (var i in this.fees){
            this.getId(true, this.fees[i].id);
            this.fees[i].selected = true;
        }

     }else{
       for (var i in this.fees){
          this.getId(false, this.fees[i].id);
          this.fees[i].selected = false;
        }
     }
   }

    getId( checked: boolean, id: any){
       if(checked){
         for (var i in this.list_id){
           if ( id == this.list_id[i] ){
             return false;
           }
         }
         this.list_id.push(id);
       }else{
         var index = this.list_id.indexOf(id);
         this.list_id.splice(index, 1);
       }
       console.log(this.list_id)
    }

   submit(){
     var fee_temp: Fee;
     for (var i in this.list_id){
       fee_temp = this.fees.find( fee => fee.id == this.list_id[i] );
       this.fees = this.fees.filter( fees => fees !== fee_temp  );
     }
     // this.feeService.deleteListFee(this.list_id).subscribe();
   }
   apply_fee(id: number){
     var fee = this.fees.find( fee => fee.id == id);
     this.fees.filter( item =>{ 
       if(item.is_apply == true && item.position == fee.position) 
         item.is_apply = false;  
     });
     fee.is_apply = true;
     this.feeService.applyFee(id).subscribe();
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
