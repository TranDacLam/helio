import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';

import { Feedback } from '../../shared/class/feedback';
import { api } from '../utils/api';

@Injectable()
export class FeedbackService {

	httpOptions:any;
	token: any = '';

    private url_summary = api.summary;

	constructor(private http: Http) {

		this.token = localStorage.getItem('auth_token');

		this.httpOptions = {
			headers: new Headers({ 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            })
		};
	}

	/*
		GET: Get All Feedback Server
		@author: Trangle
	 */
	getAllFeedback(): Observable<Feedback[]> {
    	let urlFeedback = `${api.feedback}`;
		return this.http.get(urlFeedback, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}
	/*
		GET: Get Feedback By ID From Server
		@author: Trangle
	 */
	getFeedbackById(id: number): Observable<Feedback> {
		const url = `${api.feedback}${id}/`;
		return this.http.get(url, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}

	/*
		GET: Get Feedback By Filter
		Filter: Status, Rate, Start_date, End_date
		Link url: url?status=value&&rate=value&&start_date=value&&end_date=value
		@author: Trangle
	 */
  	getFeedbackFilter(filter: {status?:string, rate?:string, start_date?:string, end_date?:string}): Observable<any> {
  		const url = `${api.feedback}`;

  		let _options = new RequestOptions({
            headers: this.httpOptions.headers,
            params: filter
        });

  		return this.http.get(url, _options).map((res: Response) => res.json()).catch(this.handleError);
  	}
  	/*
  		PUT: Edit Feedback By ID
  	 */
	updateFeedbackById(feedback: Feedback): Observable<any> {
		const id = feedback.id;
		const url = `${api.feedback}${id}/`;
		var body = JSON.stringify(feedback);
		return this.http.put(url,body,this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}
	/*
		DELETE: Delete Feedback By ID
		@author: Trangle
	*/
	deleteFeedbackById(feedback: Feedback): Observable<Feedback> {
		const id = feedback.id;
		const url = `${api.feedback}${id}/`;
		return this.http.delete(url,this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}
	/*
		DELETE: Delete All Feedback chosen
		@author: Trangle
	 */
	deleteAllFeedbackChecked(fed_id): Observable<any> {
		let param = {
            fed_id: fed_id
        }
        let _options = new RequestOptions({
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });
    	return this.http.delete(api.feedback, _options)
    		.map((res: Response) => res.json()).catch(this.handleError);
  	}

    /* 
        function getStatisticFeedback(): get summary feedback status handle and rating
        author: Lam
    */
    getStatisticFeedback(): Observable<any>{
        return this.http.get(this.url_summary, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function getStatisticFeedback(): get summary feedback status handle and rating by search_field, date start, end
        author: Lam
    */
    searchStatisticFeedback(name, start, end): Observable<any>{
        let url_search = `${this.url_summary}?search_field=${name}&start_date=${start}&end_date=${end}`;
        return this.http.get(url_search, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }


	/*
		Handler Error
	*/
	handleError(error: Response) {
		return Observable.throw(error);
	}
}
