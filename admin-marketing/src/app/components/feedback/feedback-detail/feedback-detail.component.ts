import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

import { FeedbackService } from '../../../shared/services/feedback.service';
import { Feedback, Status, en_Status, vi_Type, en_Type } from '../../../shared/class/feedback';

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
  	tus = Status; // List status with vietnames
    en_tus = en_Status; // List status with english
    vi_type = vi_Type;
    en_type = en_Type;
    
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
            created: [this.feedback.created],
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
        let valueForm = this.translateValueFeedbackForm(this.feedbackForm.value);
    	this.feedbackService.updateFeedbackById(valueForm, this.feedback.id)
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

    translateValueFeedbackForm(value) {
        // Transalte for feedback_type before save server
        if (value.feedback_type == this.vi_type[1]) {
            value.feedback_type = this.en_type[1]
        }else if (value.feedback_type == this.vi_type[0]) {
            value.feedback_type = this.en_type[0]
        }
        // Translate for status before save server
        switch (value.status) {
            case this.tus[0]:
                value.status = this.en_tus[0]
                break;
            case this.tus[1]:
                value.status = this.en_tus[1]
                break;
            case this.tus[2]:
                value.status = this.en_tus[2]
                break;
        } 
        return value;
    }
}
