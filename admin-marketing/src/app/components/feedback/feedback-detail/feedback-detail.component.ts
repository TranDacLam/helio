import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

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
    formFeed = new Feedback();

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
  	// Get Feedback By ID
  	getFeedback() {
    	const id = +this.route.snapshot.paramMap.get('id');
    	this.feedbackService.getFeedbackById(id)
    	.subscribe(feedback => this.feedback = feedback);
    }

    // Delete Feedback by ID
    deleteFeedback(feedback: Feedback) {
    	this.feedbackService.deleteFeedbackById(feedback).subscribe(() => this.router.navigate(['/feedback-list', { message_del: feedback.name} ]));
    }
    // Update Feedback by ID
    updateFeedback() {
    	this.feedbackService.updateFeedbackById(this.feedback)
    	.subscribe(() => this.router.navigate(['/feedback-list', { message_put: this.feedback.name} ]))
    }
}
