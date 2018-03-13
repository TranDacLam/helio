import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router } from '@angular/router';

import { HotAdvs } from '../../../shared/class/hot-advs';
import { HotAdvsService } from '../../../shared/services/hot-advs.service';

import { data_config } from '../../../shared/commons/datatable_config';

declare var bootbox:any;

@Component({
  selector: 'app-hot-advs-list',
  templateUrl: './hot-advs-list.component.html',
  styleUrls: ['./hot-advs-list.component.css'],
  providers: [HotAdvsService],
})
export class HotAdvsListComponent implements OnInit {

	dtOptions: any = {};
	hot_adv_selected: any;

	hot_advs : HotAdvs [];

  	message_result:string = ''; // Message result

    record: String = "Hot Advs";
    
  	// Inject the DataTableDirective into the dtElement property
  	@ViewChild(DataTableDirective)
  	dtElement: DataTableDirective;

	// Using trigger becase fetching the list of feedbacks can be quite long
  	// thus we ensure the data is fetched before rensering
	dtTrigger: Subject<any> = new Subject();

  	constructor(
  		private route: ActivatedRoute,
        private hotAdvsSerice: HotAdvsService,
        private router: Router,
  		) {
  			this.hot_advs = [];
  			this.hot_adv_selected = [];
  		}

  	ngOnInit() {
        this.getHotAdvs();
  		this.dtOptions = data_config(this.record).dtOptions;
	  	
        this.route.params.subscribe(params => {
            if( params.message_post ){
                this.message_result = " Thêm "+ params.message_post + " thành công.";
            } else {
                this.message_result = "";
            }
          });

  	}
  	getHotAdvs() {
        this.hotAdvsSerice.getAllHotAdvs().subscribe(
            (result) => {
                this.hot_advs = result;
                this.dtTrigger.next(); 
            },
            (error) =>  {
                this.router.navigate(['/error', { message: error.json().message }])
            }
          )
  	}
  	/* Function: Select All Banner
        Check checkbox all selected
        True: push id in array
        @author: TrangLe
     */
  	checkAllHotAdvs(event){
        let array_del = [];
        if(event.target.checked){
            this.hot_advs.forEach(function(element) {
                array_del.push(element.id);
                $('#'+element.id).prop('checked', true);
            });
            this.hot_adv_selected = array_del;
            this.message_result = "";
        }else{
            this.hot_advs.forEach((item, index) => {
        		this.hot_adv_selected.splice(index, this.hot_advs.length);
                $('#'+item.id).prop('checked', false);
     		});
        }
    }

  	// Change checkbox item
  	checkItemChange(event, deno) {
  		if(event.target.checked){
        	this.hot_adv_selected.push(deno.id);
            if(this.hot_adv_selected.length == this.hot_advs.length) {
                $('#allCheck').prop('checked', true)
            }
            this.message_result = "";
      	}
      	else{

       		let index = this.hot_adv_selected.indexOf(deno.id);
       		this.hot_adv_selected.splice(index, 1);

            $('#allCheck').prop('checked', false);
      	}
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
            bootbox.alert("Vui lòng chọn hot advs để xóa");
        } 
    }
    deleteHotAdvsCheckbox() {
          this.hotAdvsSerice.deleteHotAdvsSelected(this.hot_adv_selected).subscribe(
            (data) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    var self = this;
                    this.hot_adv_selected.forEach(function(e){
                        dtInstance.rows('#delete'+e).remove().draw();
                        var item = self.hot_advs.find(hot_adv => hot_adv.id == e);
                        self.hot_advs = self.hot_advs.filter(hot_advs => hot_advs !== item);
                    });
                    this.hot_adv_selected = [];
                });
               this.message_result = "Xóa Hot Advs thành công";
            },
            (error) => {
               this.router.navigate(['/error', { message: error.json().message }])
            }
        )
    }

}
