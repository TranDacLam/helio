import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Subject } from 'rxjs/Subject';

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
	@Output()
    save: EventEmitter<number[]> = new EventEmitter<number[]>();
	dtOptions: any = {};
	advs : Advertisement[];
	isChecked = false;
	selectedAdvs = [];
	noDuplicate: boolean;
	// Using trigger becase fetching the list of feedbacks can be quite long
    // thus we ensure the data is fetched before rensering
	dtTrigger: Subject<any> = new Subject();

  	constructor(
  		private advertisementService: AdvertisementService
  		) { }

 	ngOnInit() {
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
	        select: {
	          	style: 'multi',
            	selector: 'td:first-child'
	          },
	  	};
	  	this.getAllAdvertisement();
  	}

  	// Get All Advertisement
  	getAllAdvertisement() {
  		this.advertisementService.getAllAdvertisement().subscribe(
  			result => {
  				this.advs = result;
  				this.dtTrigger.next();
  			});
  	}
  	// Check all checkbox
  	checkAllAdv(event) {
	    this.isChecked = !this.isChecked;
	}

	// Delete all checkbox selected
	deleteAllCheckAdvs() {
	    if (this.isChecked) {
	      	this.advs.forEach((item, index) => {
	      		console.log(this.advs[index].id);
	        	// this.advs.splice(index, this.advs.length);
	      });
	    }else {
	      this.deleteItemAdvs();
	    }
  	}
  	// Delete Each Checkbox chosen
  	deleteItemAdvs() {
	    this.advs.forEach((item, index) => {
	        this.selectedAdvs.forEach((subitem, subindex)=>{
	          if (item.id == subitem.id) {
	           this.advs.splice(index, this.selectedAdvs.length);
	          }
	        })
	      })
  	}
	getItemAdvs(item, i) {
	    if (this.selectedAdvs.length == 0) {
	      		this.selectedAdvs.push({id: item.id,isSlected: true});
	    }else {
	      this.selectedAdvs.forEach((newitem, index)=> {
	        if(this.selectedAdvs[index].id == item.id) {
	          	this.selectedAdvs.splice(index, 1);
	          	this.noDuplicate = true;
	        }else {
	          	this.noDuplicate = false;
	        }
	      });
	      if (!this.noDuplicate) {
	        	this.selectedAdvs.push({id: item.id,isSlected: true});
	      }
	    }
	    // console.log(this.selectedAdvs);
	  }
}
