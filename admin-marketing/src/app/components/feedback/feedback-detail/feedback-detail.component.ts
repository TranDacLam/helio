import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
	feedback: Feedback;

  	feedbacks: Feedback[];
  	tus = Status; // List rating
    
    errorMessage: string;

  	constructor(
  		private feedbackService: FeedbackService,
  		private route: ActivatedRoute,
  		private location: Location,
    	private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
  		) {
  			
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
	        name: [this.feedback.name],
	        email: [this.feedback.email],
	        phone: [this.feedback.phone],
	        subject: [this.feedback.subject],
	        message: [this.feedback.message],
	        feedback_type: [this.feedback.feedback_type],
	        sent_date: [this.feedback.sent_date],
	        rate: [this.feedback.rate],
	        status: [this.feedback.status],
	        answer: [this.feedback.answer, [Validators.maxLength(1000)]],     
      })
  	}
  	/*
        Function: Get Feedback By Id
        @author: Trangle      
    */
  	getFeedback() {
    	const id = +this.route.snapshot.paramMap.get('id');
    	this.feedbackService.getFeedbackById(id).subscribe(
            feedback => {
                this.feedback = feedback,
                this.createFormFeedback();
            },
            error =>  this.router.navigate(['/error', { message: error }])
        );
    }

    /*
        DELETE: Delete Feedback By Id
        @author: TrangLe
    */
    deleteFeedback(feedback: Feedback) {
    	this.feedbackService.deleteFeedbackById(feedback)
            .subscribe(
                () => {
                    this.toastr.success(`Xóa ${feedback.name} thành công`);
                    this.router.navigate(['/feedback-list']);
                },
                error =>  this.router.navigate(['/error', { message: error.json().message }])
           );
    }
    /* 
        PUT: Update Feedback by ID
        @author: TrangLe
    */
    updateFeedback() {
    	this.feedbackService.updateFeedbackById(this.feedbackForm.value, this.feedback.id)
    	    .subscribe(
                () => {
                    this.toastr.success(`Chỉnh sửa ${this.feedback.name} thành công`);
                    this.router.navigate(['/feedback-list']);
                },
                (error) =>  {
                    if (error.status == 400) {
                        this.errorMessage = error.json().message
                    } else {
                        this.router.navigate(['/error', { message: error.json().message }])
                    }
                    
                }
            )
    }

    /* 
        Confirm delete feedback detail
        Using: bootbox plugin
        @author: Trangle
    */
    confirmDeleteFeedback(feedback: Feedback) {
        bootbox.confirm({
            title: "Bạn có chắc chắn ?",
            message: "Bạn muốn xóa Phản Hồi này",
            buttons: {
                cancel: {
                    label: "HỦY"
                },
                confirm: {
                    label: "XÓA"
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
