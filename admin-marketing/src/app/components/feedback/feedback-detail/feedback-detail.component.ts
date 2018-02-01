import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';

import { FeedbackService } from '../../../shared/services/feedback.service';
import { Feedback, Status  } from '../../../shared/class/feedback';

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

  	constructor(
  		private feedbackService: FeedbackService,
  		private route: ActivatedRoute,
  		private location: Location,
    	private fb: FormBuilder,
  		) {
  			this.createFormFeedback();
  		 }

  	ngOnInit() {
  		this.getFeedback()
  	}

  	createFormFeedback() {
  		this.feedbackForm = this.fb.group({
	        name: '',
	        email: '',
	        phone: '',
	        subject: '',
	        message: '',
	        feedback_type: '',
	        sent_date: '',
	        rate: '',
	        status: '',
	        answer: '',     
      })
  	}
  	goBack() {
    	this.location.back();
    }

  	// Get Feedback By ID
  	getFeedback() {
    	const id = +this.route.snapshot.paramMap.get('id');
    	this.feedbackService.getFeedbackById(id)
    	.subscribe(feedback => this.feedback = feedback);
    }

    // Delete Feedback by ID
    deleteFeedback(feedback: Feedback) {
    	this.feedbackService.deleteFeedbackById(feedback).subscribe(() => this.goBack());
    }
    // Update Feedback by ID
    updateFeedback() {
    	this.feedbackService.updateFeedbackById(this.feedback)
    	.subscribe(() => this.goBack())
    }
}
