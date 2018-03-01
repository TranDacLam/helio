import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';

import { HotAdvs } from '../../../shared/class/hot-advs';
import { data_config } from '../../../shared/commons/datatable_config';

declare var bootbox:any;

@Component({
  selector: 'app-hot-advs-list',
  templateUrl: './hot-advs-list.component.html',
  styleUrls: ['./hot-advs-list.component.css']
})
export class HotAdvsListComponent implements OnInit {

	dtOptions: any = {};
	select_checkbox = false; // Default checkbox false
	hot_adv_selected: any;
	hot_advs : HotAdvs [];
	message_success: string = ""; // Display message success
  	message_result = ''; // Message result

  	// Inject the DataTableDirective into the dtElement property
  	@ViewChild(DataTableDirective)
  	dtElement: DataTableDirective;

	// Using trigger becase fetching the list of feedbacks can be quite long
  	// thus we ensure the data is fetched before rensering
	dtTrigger: Subject<any> = new Subject();

  	constructor(
  		private route: ActivatedRoute
  		) {
  			this.hot_advs = [];
  			this.hot_adv_selected = [];
  		}

  	ngOnInit() {
  		this.dtOptions = data_config.dtOptions;
	  	this.getAllHotAdvs();
  	}

  	getAllHotAdvs() {

  	}
  	// Checkbox all
  	checkAllHotAdvs(event){
        let array_del = [];
        if(event.target.checked){
            this.hot_advs.forEach(function(element) {
                array_del.push(element.id);
            });
            this.hot_adv_selected = array_del;
            this.select_checkbox = true;
            this.message_success = "";
            this.message_result = "";
        }else{
            this.select_checkbox = false;
            this.hot_advs.forEach((item, index) => {
        		this.hot_adv_selected.splice(index, this.hot_advs.length);
     		});
        }
    }

  	// Change checkbox item
  	checkItemChange(event, deno) {
  		if(event.target.checked){
        	this.hot_adv_selected.push(deno.id);
          this.message_success = "";
          this.message_result = "";
      	}
      	else{
       		let updateDenoItem = this.hot_adv_selected.find(this.findIndexToUpdate, deno.id);

       		let index = this.hot_adv_selected.indexOf(updateDenoItem);

       		this.hot_adv_selected.splice(index, 1);
      	}
  	}
  	findIndexToUpdate(type) { 
        return type.id === this;
    }

    confirmDelete() {
        /* Check hot_adv_selected not null and length >0
            True: Show confirm and call function deleteFeedbackCheckbox 
            False: show alert
        */
        if(this.hot_adv_selected !== null && this.hot_adv_selected.length > 0 ){
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.hot_adv_selected.length + " phần tử đã chọn",
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
                        this.deleteHotAdvsCheckbox()
                    }
                }
            });
        } else {
            bootbox.alert("Vui lòng chọn banner để xóa");
        } 
    }
    deleteHotAdvsCheckbox() {

    }

}
