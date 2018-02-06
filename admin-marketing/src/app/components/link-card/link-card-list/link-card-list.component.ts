import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-link-card-list',
  templateUrl: './link-card-list.component.html',
  styleUrls: ['./link-card-list.component.css']
})
export class LinkCardListComponent implements OnInit {

	dtOptions: any = {};
	link_cards = [];
	checkbox_selected = false; // Default feedback selected false
    link_card_del: any;
    message_success: string = ""; // Display message success
    message_error: string = ""; // Display message error
    message_result: string = ""; // Display message result


    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

	  // Using trigger becase fetching the list of feedbacks can be quite long
	  // thus we ensure the data is fetched before rensering
	  // dtTrigger: Subject<any> = new Subject();
  	constructor(
  		private route: ActivatedRoute
  		) { 
  		this.link_card_del = [];
  	}

  	ngOnInit() {
  		this.dtOptions = {
          language: {
            sSearch: '',
            searchPlaceholder: ' Nhập thông tin tìm kiếm',
            lengthMenu: 'Hiển thị _MENU_ Thẻ Liên Kết',
            info: "Hiển thị _START_ tới _END_ của _TOTAL_ Thẻ Liên Kết",
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
          zeroRecords: 'Không có Thẻ Liên Kết nào để hiển thị',
          infoEmpty: ""
          },
          responsive: true,
          pagingType: "full_numbers",
        };
        this.getAllLinkCards();
  	}

  	getAllLinkCards() {

  	}
  	selectAllCheckbox(event) {
        let arr = [];
        if (event.target.checked) {
            this.link_cards.forEach(function(element) {
            arr.push(element.id)
          });
            this.link_card_del = arr
            this.checkbox_selected = true;
            this.message_error = "";
            this.message_result = "";
        } else {
            this.checkbox_selected = false;
            this.link_cards.forEach((item, index) => {
            this.link_card_del.splice(index, this.link_cards.length);
        });
    }
    }

  	changeCheckboxLinkCard(event, linkCard) {
  		if(event.target.checked) {
            this.link_card_del.push(linkCard.id)
            this.message_error ='';
            this.message_result = "";
        } else {
            let updateItem = this.link_card_del.find(this.findIndexToUpdate, linkCard.id);

            let index = this.link_card_del.indexOf(updateItem);

            this.link_card_del.splice(index, 1);
        }
  	}
  	findIndexToUpdate(linkCard) { 
        return linkCard.id === this;
    }

  	deleteLinkCardCheckbox() {
  	}

}
