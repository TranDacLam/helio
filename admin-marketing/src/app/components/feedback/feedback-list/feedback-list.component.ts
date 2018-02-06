import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

import { Feedback } from '../../../shared/class/feedback';

import { FeedbackService } from '../../../shared/services/feedback.service';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit {

	dtOptions: any = {};
    feedbacks: Feedback[];
    feedback_selected = false; // Default feedback selected false
    feedback_del: any;
    message_success: string = ""; // Display message success
    message_error: string = ""; // Display message error
    message_result: string = ""; // Display message result
    errorMessage: String;

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

	  // Using trigger becase fetching the list of feedbacks can be quite long
	  // thus we ensure the data is fetched before rensering
	  dtTrigger: Subject<any> = new Subject();
	  constructor(
      private feedbackService: FeedbackService,
      private route: ActivatedRoute
    ) {
    this.feedbacks = [];
    this.feedback_del = [];
   }

	ngOnInit() {
		this.dtOptions = {
          language: {
            sSearch: '',
            searchPlaceholder: ' Nhập thông tin tìm kiếm',
            lengthMenu: 'Hiển thị _MENU_ Phản hồi',
            info: "Hiển thị _START_ tới _END_ của _TOTAL_ Phản hồi",
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
          zeroRecords: 'Không có phản hồi nào để hiển thị',
          infoEmpty: ""
          },
          responsive: true,
          pagingType: "full_numbers",
        };
        this.getAllFeedbacks();
        this.route.params.subscribe(params => {
            if(params.message_put){
                this.message_result = " Chỉnh sửa "+ params.message_put + " thành công.";
            } else if (params.message_del) {
              this.message_result = "Xóa " +params.message_del + " thành công.";
            }
            else {
              this.message_result = "";
            }
        });
    	}
        
	// Get All Feedback to show
	getAllFeedbacks() {
		this.feedbackService.getAllFeedback()
			.subscribe(
				feedbacks => {
					this.feedbacks = feedbacks;
					// Caling the DT trigger to manually render the table
					this.dtTrigger.next();
				},
        error =>  this.errorMessage = <any>error
        );
	}
    selectAllCheckbox(event) {
        let arrFeedback_del = [];
        if (event.target.checked) {
            this.feedbacks.forEach(function(element) {
            arrFeedback_del.push(element.id)
          });
            this.feedback_del = arrFeedback_del
            this.feedback_selected = true;
            this.message_error = "";
            this.message_result = "";
        } else {
            this.feedback_selected = false;
            this.feedbacks.forEach((item, index) => {
            this.feedback_del.splice(index, this.feedbacks.length);
        });
    }
    }
    changeCheckboxFeedback(event, feedback) {
        if(event.target.checked) {
            this.feedback_del.push(feedback.id)
            this.message_error ='';
            this.message_result = "";
        } else {
            let updateDenoItem = this.feedback_del.find(this.findIndexToUpdate, feedback.id);

            let index = this.feedback_del.indexOf(updateDenoItem);

            this.feedback_del.splice(index, 1);
        }
    }
    findIndexToUpdate(feedback) { 
        return feedback.id === this;
    }
    deleteFeedbackCheckbox() {
      if (this.feedback_del !== null) {
        if( this.feedback_del.length == 0) {
          this.message_error = "Vui lòng chọn phản hồi để xóa";
          this.message_result = "";
      } else {
        this.feedbackService.deleteAllFeedbackChecked(this.feedback_del).subscribe(
        result => {
             this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
               this.feedback_del.forEach(function(e){
                 dtInstance.rows('#delete'+e).remove().draw();
               });
             });
            this.message_success = "Xóa phản hồi thành công";
          },
          error =>  this.errorMessage = <any>error
          );
        }
      } else {
        return 0;
      }
    }
}
