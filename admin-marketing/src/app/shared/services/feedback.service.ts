import { Injectable } from '@angular/core';

import { Http, Headers, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Feedback } from '../../shared/class/feedback';
import { api } from '../utils/api';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class FeedbackService {

	constructor(private http: HttpClient) { }

	// Get All Feedack
	getAllFeedback(): Observable<Feedback[]> {
    let urlFeedback = `${api.feedback}`;
		return this.http.get<Feedback[]>(urlFeedback).catch(this.handleError)
	}
	// GET: get Feedback by Id
	getFeedbackById(id: number): Observable<Feedback> {
		const url = `${api.feedback}${id}/`;
		return this.http.get<Feedback>(url, httpOptions).catch(this.handleError)
	}

  // GET: get Feedback by Status
  getFeedbackFilter(filter: {status:string|null, rate:string|null, start_date:string|null, end_date: any|null}): Observable<Feedback[]> {
    const url = `${api.feedback}?status=${filter.status}&rate=${filter.rate}&start_date=${filter.start_date}&end_date=${filter.end_date}`;
    return this.http.get<Feedback[]>(url).catch(this.handleError)
  }

	// PUT: Edit Feedback by id
	updateFeedbackById(feedback: Feedback): Observable<any> {
		const id = feedback.id;
		const url = `${api.feedback}${id}/`;
		return this.http.put<Feedback>(url, feedback, httpOptions).catch(this.handleError)
	}
	// DELETE: Delete Feedback by id
	deleteFeedbackById(feedback: Feedback): Observable<Feedback> {
		const id = feedback.id;
		const url = `${api.feedback}${id}/`;
		return this.http.delete<Feedback>(url,httpOptions).catch(this.handleError)
	}
	// Delete All Feedback which checkbox
	
	deleteAllFeedbackChecked(fed_id: Feedback[]): Observable<Feedback[]> {
    const url = `${api.feedback}?fed_id=${fed_id}`;
    return this.http.delete<Feedback[]>(url, httpOptions)
    .catch(this.handleError)
  }

	// Handle error
	handleError(error: Response) {
		return Observable.throw(error);
	}
}
