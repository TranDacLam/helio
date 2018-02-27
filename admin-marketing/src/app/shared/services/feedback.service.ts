import { Injectable } from '@angular/core';

import { Http, Headers, Response } from "@angular/http";
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';

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

    private url_summary = api.summary;

	// filter = new Filter();
	constructor(private http: HttpClient) { }

	/*
		GET: Get All Feedback Server
	 */
	getAllFeedback(): Observable<Feedback[]> {
    	let urlFeedback = `${api.feedback}`;
		return this.http.get<Feedback[]>(urlFeedback).catch(this.handleError)
	}
	/*
		GET: Get Feedback By ID From Server
	 */
	getFeedbackById(id: number): Observable<Feedback> {
		const url = `${api.feedback}${id}/`;
		return this.http.get<Feedback>(url, httpOptions).catch(this.handleError)
	}

	/*
		GET: Get Feedback By Filter
		Filter: Status, Rate, Start_date, End_date
	 */
  	getFeedbackFilter(filter: {status?:string, rate?:string, start_date?:string, end_date?:string}): Observable<Feedback[]> {
  		return this.http.get<Feedback[]>(`${api.feedback}`, {params: filter})
  	}
  	/*
  		PUT: Edit Feedback By ID
  	 */
	updateFeedbackById(feedback: Feedback): Observable<any> {
		const id = feedback.id;
		const url = `${api.feedback}${id}/`;
		return this.http.put<Feedback>(url, feedback, httpOptions).catch(this.handleError)
	}
	/*
		DELETE: Delete Feedback By ID
	*/
	deleteFeedbackById(feedback: Feedback): Observable<Feedback> {
		const id = feedback.id;
		const url = `${api.feedback}${id}/`;
		return this.http.delete<Feedback>(url,httpOptions).catch(this.handleError)
	}
	/*
		DELETE: Delete All Feedback chosen
	 */
	deleteAllFeedbackChecked(fed_id: Feedback[]): Observable<Feedback[]> {
    	const url = `${api.feedback}?fed_id=${fed_id}`;
    	return this.http.delete<Feedback[]>(url, httpOptions)
    		.catch(this.handleError)
  	}

    /* 
        function getStatisticFeedback(): get summary feedback status handle and rating
        author: Lam
    */
    getStatisticFeedback(): Observable<any>{
        return this.http.get(this.url_summary).catch(this.handleError);
    }

    /* 
        function getStatisticFeedback(): get summary feedback status handle and rating by search_field, date start, end
        author: Lam
    */
    searchStatisticFeedback(name, start, end): Observable<any>{
        let url_search = `${this.url_summary}search_field=${name}&start_date=${start}&end_date=${end}`;
        return this.http.get(this.url_summary).catch(this.handleError);
    }


	/*
		Handler Error
	*/
	handleError(error: Response) {
		return Observable.throw(error);
	}
}
