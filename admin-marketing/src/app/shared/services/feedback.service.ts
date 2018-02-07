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

	  private urlFeedback = `${api.feedback}`;

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
    // GET: Get Feedback by status
    getFeedbackByStatus(status: string): Observable<Feedback[]> {
      const url = `${this.urlFeedback}?status=${status}`;
      return this.http.get<Feedback[]>(url).catch(this.handleError)
    }

    // GET: get Feedback by status and start_date
    getFeedbackByStatusAndStartDate(status: string, start_date: string): Observable<Feedback[]> {
      const url = `${this.urlFeedback}?status=${status}&start_date=${start_date}`;
      return this.http.get<Feedback[]>(url).catch(this.handleError)
    }

    // GET: get Feedback by status and end_date
    getFeedbackByStatusAndEndDate(status: string, end_date: string): Observable<Feedback[]> {
      const url = `${this.urlFeedback}?status=${status}&end_date=${end_date}`;
      return this.http.get<Feedback[]>(url).catch(this.handleError)
    }

    // GET: get Feedback by status, start_date and end_date
    getFeedbackByStatusStartAndEndDate(status: string, start_date: string, end_date:string): Observable<Feedback[]> {
      const url = `${this.urlFeedback}?status=${status}&start_date=${start_date}&end_date=${end_date}`;
      return this.http.get<Feedback[]>(url).catch(this.handleError)
    }

    // GET: Get Feedback by rate
    getFeedbackByRate(rate: string): Observable<Feedback[]> {
      const url = `${this.urlFeedback}?rate=${rate}`;
      return this.http.get<Feedback[]>(url).catch(this.handleError)
    }

    // GET: get Feedback by rate and start_date
    getFeedbackByRateAndStartDate(rate: string, start_date: string): Observable<Feedback[]> {
      const url = `${this.urlFeedback}?rate=${rate}&start_date=${start_date}`;
      return this.http.get<Feedback[]>(url).catch(this.handleError)
    }

    // GET: get Feedback by rate and end_date
    getFeedbackByRateAndEndDate(rate: string, end_date: string): Observable<Feedback[]> {
      const url = `${this.urlFeedback}?rate=${rate}&end_date=${end_date}`;
      return this.http.get<Feedback[]>(url).catch(this.handleError)
    }

    // GET: get Feedback by rate, start_date and end_date
    getFeedbackByRateStartAndEndDate(rate: string, start_date: string, end_date:string): Observable<Feedback[]> {
      const url = `${this.urlFeedback}?rate=${rate}&start_date=${start_date}&end_date=${end_date}`;
      return this.http.get<Feedback[]>(url).catch(this.handleError)
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
      return this.http.delete<Feedback[]>(url, httpOptions)
      .catch(this.handleError)
    }

  	// Handle error
  	handleError(error: Response) {
  		return Observable.throw(error);
  	}
}
