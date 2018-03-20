import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';

import { Feedback } from '../../../shared/class/feedback';

import { FeedbackService } from '../../../shared/services/feedback.service';

import { Subject } from 'rxjs/Subject';
import { data_config } from '../../../shared/commons/datatable_config';

declare var bootbox:any;

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements OnInit {

	dtOptions: any = {};
    feedbacks: Feedback[];

    feedback_del: any;
    allFeedbacks: any;

    checkbox:boolean =false;

    message_result: string = ""; // Display message result
    errorMessage: string;
    record: string = "Phản Hồi";

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    // Using trigger becase fetching the list of feedbacks can be quite long
    // thus we ensure the data is fetched before rensering
	dtTrigger: Subject<any> = new Subject();
    constructor(
        private feedbackService: FeedbackService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.feedbacks = [];
        this.feedback_del = [];
    }

	ngOnInit() {
        // Call dataTable
        this.dtOptions = data_config(this.record);
        
        // Call get all feedback
        this.getAllFeedbacks();
        this.route.queryParams
            .subscribe(params => {
                this.feedbackService.getFeedbackFilter(params).subscribe(
                    (result) => {
                        this.feedbacks = result;
                    },
                    (error) => {
                        this.router.navigate(['/error', { message: error.json().message }])
                    }
                )
        });
        this.route.params.subscribe((params: any) => {
            if(params.message_put){
                this.message_result = " Chỉnh sửa "+ params.message_put + " thành công.";
            } else if ( params.message_del ) {
                this.message_result = "Xóa " +params.message_del + " thành công.";
            } else {
                this.message_result = "";
            }
        });
    	}

	/*
        GET: Get all Feedback To Show
        Call api from service feedback
        @author: TrangLe
     */
	getAllFeedbacks() {
		this.feedbackService.getAllFeedback().subscribe(
			(feedbacks) => {
				this.feedbacks = feedbacks;
				// Caling the DT trigger to manually render the table
				this.dtTrigger.next();
			},
            (error) =>  this.router.navigate(['/error', { message: error.json().message }])
        );
	}
    /*
        Function: Select All Checkbox
        If checked: Push ID into arrFeedback_del,feedback_selected = True
        Else: feedback_selected = False
        @author: Trangle
     */
    selectAllCheckbox(event) {
        let arrFeedback_del = [];
        if (event.target.checked) {
            this.feedbacks.forEach(function(element) {
                arrFeedback_del.push(element.id)
                $('#'+element.id).prop('checked', true);
            });
            this.checkbox = true;
            this.feedback_del = arrFeedback_del
            this.message_result = "";
        } else {
            this.checkbox = false;
            this.feedbacks.forEach((item, index) => {
                this.feedback_del.splice(index, this.feedbacks.length);
                $('#'+item.id).prop('checked', false);
            });
        }
    }
    /*
        Function: Selected each item
        @author: Trangle
     */
    changeCheckboxFeedback(event, feedback) {
        if(event.target.checked) {
            this.feedback_del.push(feedback.id);
            if(this.feedback_del.length == this.feedbacks.length) {
                $('#allCheck').prop('checked', true);
            }
            this.message_result = "";
        } else {
            let index = this.feedback_del.indexOf(feedback.id);
            this.feedback_del.splice(index, 1);

            $('#allCheck').prop('checked', false);
        }
    }

    /*
        Confirm Delete Checkbox Selected
        Using bootbox plugin
        @author: Trangle
     */
    confirmDelete() {
        /* Check feedback_del not null and length >0
            True: Show confirm and call function deleteFeedbackCheckbox 
            False: show alert
        */
        if(this.feedback_del !== null && this.feedback_del.length > 0 ){
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.feedback_del.length + " phản hồi đã chọn",
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
                        this.deleteFeedbackCheckbox()
                    }
                }
            });
        } else {
            bootbox.alert("Vui lòng chọn phản hồi để xóa");
        } 
    }

    /*
        DELETE: Delete All Selected Checkbox
        Call service feedback
        @author: Trangle
     */
    deleteFeedbackCheckbox() {
        this.feedbackService.deleteAllFeedbackChecked(this.feedback_del).subscribe(
            (result) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    var self = this;
                    this.feedback_del.forEach(function(e){
                        dtInstance.rows('#delete'+e).remove().draw();
                        var fed_item = self.feedbacks.find(feedback => feedback.id == e);
                        self.feedbacks = self.feedbacks.filter(feedbacks => feedbacks !== fed_item);
                    });
                this.feedback_del = [];
            });
            this.message_result = "Xóa phản hồi thành công";
           },
            (error) => {
                this.router.navigate(['/error', { message: error.json().message }])
            }
        );
    }
}
