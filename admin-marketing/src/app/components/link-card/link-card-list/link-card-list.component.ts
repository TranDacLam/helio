import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';

import { LinkCardService } from '../../../shared/services/link-card.service';
import { User } from '../../../shared/class/user';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { data_config } from '../../../shared/commons/datatable_config';

declare var bootbox:any;

@Component({
  selector: 'app-link-card-list',
  templateUrl: './link-card-list.component.html',
  styleUrls: ['./link-card-list.component.css'],
  providers: [LinkCardService]
})
export class LinkCardListComponent implements OnInit {

	dtOptions: any = {};
	link_cards: User[];

    link_card_del: any;
    
    message_result: string = ""; // Display message result
    errorMessage: string;
    record: string = "Thẻ Liên Kết";

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

	// Using trigger becase fetching the list of link_cards can be quite long
	// thus we ensure the data is fetched before rensering
	dtTrigger: Subject<any> = new Subject();
  	constructor(
  		private route: ActivatedRoute,
        private linkCardService: LinkCardService,
        private router: Router,
  		) { 
  		this.link_card_del = [];
        this.link_cards = [];
  	}

  	ngOnInit() {
        // Customize DataTable
  		this.dtOptions = data_config(this.record).dtOptions;
        this.getAllLinkCards();

        this.route.params.subscribe(params => {
            if(params.message_del){
                this.message_result = 'Xóa liên kết thẻ thành công.';
                setTimeout(()=>{
                    this.message_result = '';
                },7000);
            }else{
                this.message_result = '';
            }
        });
  	}

    /*
        GET: get all link_card
        Call api service link.card
        @author: TrangLe
     */
  	getAllLinkCards() {
      this.linkCardService.getAllLinkedUsers().subscribe(
        (result) => {
          this.link_cards = result;
          // Caling the DT trigger to manually render the table
          this.dtTrigger.next();
        },
        (error) => this.router.navigate(['/error', { message: error }])
        )
  	}
    /*
        Function: Select all Checkbox
        Step: Check event checked
        True: Push id to arr
        @author: TrangLe
     */
  	selectAllCheckbox(event) {
        let arr = [];
        if (event.target.checked) {
            this.link_cards.forEach(function(element) {
            arr.push(element.id);
            $('#'+element.id).prop('checked', true);
          });
            this.link_card_del = arr
            this.message_result = "";
        } else {
            this.link_cards.forEach((item, index) => {
                this.link_card_del.splice(index, this.link_cards.length);
                $('#'+item.id).prop('checked', false);
        });
    }
    }

  	changeCheckboxLinkCard(event, linkCard) {
  		if(event.target.checked) {
            this.link_card_del.push(linkCard.id);
            if(this.link_cards.length == this.link_card_del.length) {
                $('allCheck').prop('checked', true);
            }
            this.message_result = "";
        } else {
            let index = this.link_card_del.indexOf(linkCard.id);
            this.link_card_del.splice(index, 1);

            $('allCheck').prop('checked', false);
        }
  	}

    /*
        Confirm Delete Checkbox Selected
        Using bootbox plugin
        @author: Trangle
     */
    confirmDelete() {
        /* Check link_card_del not null and length >0
            True: Show confirm and call function deleteFeedbackCheckbox 
            False: show alert
        */
        if(this.link_card_del !== null && this.link_card_del.length > 0 ){
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.link_card_del.length + " phần tử đã chọn",
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
                        this.deleteLinkCardCheckbox()
                    }
                }
            });
        } else {
            bootbox.alert("Vui lòng chọn thẻ liên kết để xóa");
        } 
    }
    /*
        Function: Delete all selected
        @author: TrangLe
     */

  	deleteLinkCardCheckbox() {
        this.linkCardService.deleteAllUserLinkedSelected(this.link_card_del).subscribe(
            (result) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                        var self = this;
                        this.link_card_del.forEach(function(e){
                            dtInstance.rows('#delete'+e).remove().draw();
                            var link_card_item = self.link_cards.find(link_card => link_card.id == e);
                            self.link_cards = self.link_cards.filter(link_cards => link_cards !== link_card_item);
                        });
                        this.link_card_del = [];
                   });
                this.message_result = "Xóa thẻ liên kết thành công";
            },
            (error) => {
                this.router.navigate(['/error', { message: error.json().message + error.json().fields }])
            }
        );
    }

}
