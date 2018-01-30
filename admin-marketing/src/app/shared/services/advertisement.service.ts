import { Injectable } from '@angular/core';

import { Http, Headers, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'; 
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch'

import { Advertisement } from '../../shared/class/advertisement';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AdvertisementService {

  	private urlAdv = 'http://127.0.0.1:8000/vi/api/advertisement/';

	constructor(private http: HttpClient) 
	{
	}
	
	// Get All Promotion Label from server
	getAllAdvertisement(): Observable<Advertisement[]>{
		return this.http.get<Advertisement[]>(this.urlAdv);
	}

	// POST: Add new Promotion Label to the server 
	addAdvertisement(adv: Advertisement): Observable<Advertisement> {
		var body = JSON.stringify(adv); // String payload
		return this.http.post<Advertisement>(this.urlAdv, adv, httpOptions)
			.catch(this.handleError);		
	}

	// GET adv by id
	getAdvertisement(id: number): Observable<Advertisement> {
		const url = `${this.urlAdv}${id}/`;
		return this.http.get<Advertisement>(url).catch(this.handleError)
	}
	// Update adv 
	updateAdv(adv: Advertisement): Observable<Advertisement> {
		const id = adv.id;
		var body = JSON.stringify(adv);
		const url = `${this.urlAdv}${id}/`;
		return this.http.put<Advertisement>(url,adv, httpOptions).catch(this.handleError);
	}
	deleteAllAdvsSelected(adv_id: Advertisement[]): Observable<Advertisement[]> {
		return this.http.post<Advertisement[]>(this.urlAdv, adv_id, httpOptions)
		.catch(this.handleError)
	}

	// Handle error
	handleError(error: Response) {
		return Observable.throw(error);
	}
}
