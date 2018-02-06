import { Injectable } from '@angular/core';

import { Http, Headers, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Feedback } from '../../shared/class/feedback';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class FeedbackService {

	private urlFeedback = "http://127.0.0.1:8000/vi/api/feedback/";

  	constructor(private http: HttpClient) { }

  	// Get All Feedack
  	getAllFeedback(): Observable<Feedback[]> {
  		return this.http.get<Feedback[]>(this.urlFeedback).catch(this.handleError)
  	}
  	// GET: get Feedback by Id
  	getFeedbackById(id: number): Observable<Feedback> {
  		const url = `${this.urlFeedback}${id}/`;
  		return this.http.get<Feedback>(url, httpOptions).catch(this.handleError)

  	}
  	// PUT: Edit Feedback by id
  	updateFeedbackById(feedback: Feedback): Observable<any> {
  		const id = feedback.id;
  		const url = `${this.urlFeedback}${id}/`;
  		return this.http.put<Feedback>(url, feedback, httpOptions).catch(this.handleError)
  	}
  	// DELETE: Delete Feedback by id
  	deleteFeedbackById(feedback: Feedback): Observable<Feedback> {
  		const id = feedback.id;
  		const url = `${this.urlFeedback}${id}/`;
  		return this.http.delete<Feedback>(url,httpOptions).catch(this.handleError)
  	}
  	// Delete All Feedback which checkbox
  	
  	deleteAllFeedbackChecked(fed_id: Feedback[]): Observable<Feedback[]> {
      const url = `${this.urlFeedback}?fed_id=${fed_id}`;
      return this.http.get<Feedback[]>(url)
      .catch(this.handleError)
    }

    /* 
        function getStatisticFeedback(): get summary feedback status handle and rating
        author: Lam
    */
    getStatisticFeedback(): Observable<any>{
      let url_summary = `http://127.0.0.1:8000/vi/api/summary/`;
      return this.http.get(url_summary).map((res: Response) => res.json()).catch(this.handleError);
    }

  	// Handle error
  	handleError(error: Response) {
  		return Observable.throw(error);
  	}
}
