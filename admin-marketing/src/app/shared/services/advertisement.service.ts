import { Injectable } from '@angular/core';

import { Http, Headers, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'; 
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { Advertisement } from '../../shared/class/advertisement';
import { api } from '../utils/api';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AdvertisementService {

	constructor(private http: HttpClient){}
	/*
		GET: Get All Advertiment From Service
		@author: TrangLe
	 */
	getAllAdvertisement(): Observable<Advertisement[]>{
		let urlAdv = `${api.advertisement}`;
		return this.http.get<Advertisement[]>(urlAdv);
	}

	/*
		POST: Add Advertiment
		@author: TrangLe
	 */ 
	addAdvertisement(adv: Advertisement): Observable<Advertisement> {
		let urlAdv = `${api.advertisement}`;
		return this.http.post<Advertisement>(urlAdv, adv, httpOptions)
		.catch(this.handleError);		
	}

	/*
		GET: Get Advertiment By Id
		@author: TrangLe
	 */
	getAdvertisement(id: number): Observable<Advertisement> {
		const url = `${api.advertisement}${id}/`;
		return this.http.get<Advertisement>(url).catch(this.handleError)
	}
	
	/*
		POST: Update detail Advertiment
		@author: TrangLe
	 */
	updateAdv(adv: Advertisement): Observable<Advertisement> {
		const id = adv.id;
		var body = JSON.stringify(adv);
		const url = `${api.advertisement}${id}/`;
		return this.http.put<Advertisement>(url,adv, httpOptions).catch(this.handleError);
	}
	/*
		DELETE: Delete All Advertiment which checked box
		@author: TrangLe
	 */
	deleteAllAdvsSelected(adv_id: Advertisement[]): Observable<Advertisement[]> {
		const url = `${api.advertisement}?adv_id=${adv_id}`;
		return this.http.delete<Advertisement[]>(url, httpOptions)
		.catch(this.handleError)
	}

	// Handle error
	handleError(error: Response) {
		return Observable.throw(error);
	}
}
