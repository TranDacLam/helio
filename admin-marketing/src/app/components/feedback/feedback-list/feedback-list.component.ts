import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

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

    length_all: Number = 0;
    length_selected: Number = 0;

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
        private toastr: ToastrService,
    ) {
        this.feedbacks = [];
    }

	ngOnInit() {
        // Call dataTable
        this.dtOptions = data_config(this.record);

        let dt_options_custom = {
            drawCallback: (setting) => {
                this.checkSelectAllCheckbox();
            },
            columnDefs: [
                {
                    targets: 1,
                    visible: false
                },
                { 
                    orderable: false, 
                    targets: 0 
                },
            ]
        };
        this.dtOptions = {...this.dtOptions, ...dt_options_custom };
        
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
                this.length_all = this.feedbacks.length;
				// Caling the DT trigger to manually render the table
				this.dtTrigger.next();
			},
            (error) =>  this.router.navigate(['/error', { message: error.json().message }])
        );
	}

      /*
        Event select checbox on row
            Case1: all row are checked then checkbox all on header is checked
            Case1: any row is not checked then checkbox all on header is not checked
        @author: Lam 
    */
    selectCheckbox(event) {   
        $(event.target).closest( "tr" ).toggleClass( "selected" );
        this.getLengthSelected();
        this.checkSelectAllCheckbox();
    }

    // input checkall checked/unchecked
    checkSelectAllCheckbox() {
        $('#select-all').prop('checked', $("#table_id tr.row-data:not(.selected)").length == 0);
        this.getLengthSelected();
    }
    /*
        Event select All Button on header table
        @author: Lam 
    */
    selectAllEvent(event) {
        if( event.target.checked ) {
            $("#table_id tr").addClass('selected');
        } else {
            $("#table_id tr").removeClass('selected');
        }
        $("#table_id tr input:checkbox").prop('checked', event.target.checked);
        this.getLengthSelected();
    }

    /*
        Function getLengthSelected(): draw length selected
        @author: Lam
    */
    getLengthSelected(){
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            this.length_selected = dtInstance.rows('.selected').count();
        })
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
        if(this.length_selected > 0 ){
            bootbox.confirm({
                title: "Bạn có chắc chắn?",
                message: "Bạn muốn xóa " + this.length_selected + " phản hồi đã chọn",
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
            this.toastr.warning(`Vui lòng chọn phản hồi cần xóa`);
        } 
    }

    /*
        DELETE: Delete All Selected Checkbox
        Call service feedback
        @author: Trangle
     */
    deleteFeedbackCheckbox() {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Get list promotion id selected
            let get_list_id = dtInstance.cells('.selected', 1).data().toArray();
            // array string to array number
            let list_id_selected = get_list_id.map(Number);

            // Call API remove list promotion selected
            this.feedbackService.deleteAllFeedbackChecked(list_id_selected).subscribe(
                (data) => {
                    this.toastr.success(`Xóa ${this.length_selected} phản hồi thành công`);

                    // Remove all promotion selected on UI
                    dtInstance.rows('.selected').remove().draw();
                    // Reset count promotion
                    this.length_all =  dtInstance.rows().count();
                    this.length_selected = 0;
                },
                (error) => {
                    this.router.navigate(['/error', { message: error.json().message }]);
                });
            });
    }
}
