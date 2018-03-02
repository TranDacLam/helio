import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgForm } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Location } from '@angular/common';

import { FeedbackService } from '../../../shared/services/feedback.service';
import { Feedback, Status  } from '../../../shared/class/feedback';

// Using bootbox 
declare var bootbox:any;

@Component({
  selector: 'app-feedback-detail',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.css']
})
export class FeedbackDetailComponent implements OnInit {

	feedbackForm: FormGroup;
	@Input() feedback: Feedback;

  	feedbacks: Feedback[];
  	status = Status; // List rating
    formFeed = new Feedback();
    
    errorMessage: string;

  	constructor(
  		private feedbackService: FeedbackService,
  		private route: ActivatedRoute,
  		private location: Location,
    	private fb: FormBuilder,
        private router: Router
  		) {
  			this.createFormFeedback();
  		 }

  	ngOnInit() {
  		this.getFeedback()
  	}

    /*
        Function: Create Form Feedback
        @author: TrangLe
     */
  	createFormFeedback() {
  		this.feedbackForm = this.fb.group({
	        name: [this.formFeed.name],
	        email: [this.formFeed.email],
	        phone: [this.formFeed.phone],
	        subject: [this.formFeed.subject],
	        message: [this.formFeed.message],
	        feedback_type: [this.formFeed.feedback_type],
	        sent_date: [this.formFeed.sent_date],
	        rate: [this.formFeed.rate],
	        status: [this.formFeed.status],
	        answer: [this.formFeed.answer],     
      })
  	}
  	/*
        Function: Get Feedback By Id
        @author: Trangle      
    */
  	getFeedback() {
    	const id = +this.route.snapshot.paramMap.get('id');
    	this.feedbackService.getFeedbackById(id)
    	.subscribe(
        feedback => this.feedback = feedback,
        error =>  this.errorMessage = <any>error
        );
    }

    /*
        DELETE: Delete Feedback By Id
        @author: TrangLe
    */
    deleteFeedback(feedback: Feedback) {
    	this.feedbackService.deleteFeedbackById(feedback)
            .subscribe(
                () => this.router.navigate(['/feedback-list', { message_del: feedback.name} ]),
                error =>  this.errorMessage = <any>error
           );
    }
    /* 
        PUT: Update Feedback by ID
        @author: TrangLe
    */
    updateFeedback() {
    	this.feedbackService.updateFeedbackById(this.feedback)
    	    .subscribe(
                () => this.router.navigate(['/feedback-list', { message_put: this.feedback.name} ]),
                error =>  this.errorMessage = <any>error
            )
    }

    /* 
        Confirm delete feedback detail
        Using: bootbox plugin
        @author: Trangle
    */
    confirmDeleteFeedback(feedback: Feedback) {
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa phản hồi này.",
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
                    // Check result = true. call function callback
                    this.deleteFeedback(feedback)
                }
            }
        });
    }
}
