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
   errorText: string;
   dtTrigger: Subject<any> = new Subject();
   dtOptions: DataTables.Settings = {};



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
