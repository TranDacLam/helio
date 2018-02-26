import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from "@angular/http";

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'; 
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { Advertisement } from '../../shared/class/advertisement';
import { api } from '../utils/api';

const httpOptions = {
	headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AdvertisementService {

	constructor(private http: Http){}
	/*
		GET: Get All Advertiment From Service
		@author: TrangLe
	 */
	getAllAdvertisement(): Observable<any>{
		let urlAdv = `${api.advertisement}`;
		return this.http.get(urlAdv).map((res: Response) => res.json()).catch(this.handleError);
	}

	/*
		POST: Add Advertiment
		@author: TrangLe
	 */ 
	addAdvertisement(adv: Advertisement): Observable<Advertisement> {
		let urlAdv = `${api.advertisement}`;
		return this.http.post(urlAdv, adv, httpOptions)
		.map((res: Response) => res.json()).catch(this.handleError);		
	}

	/*
		GET: Get Advertiment By Id
		@author: TrangLe
	 */
	getAdvertisement(id: number): Observable<Advertisement> {
		const url = `${api.advertisement}${id}/`;
		return this.http.get(url).map((res: Response) => res.json()).catch(this.handleError);
	}
	
	/*
		POST: Update detail Advertiment
		@author: TrangLe
	 */
	updateAdv(adv: Advertisement): Observable<Advertisement> {
		const id = adv.id;
		var body = JSON.stringify(adv);
		const url = `${api.advertisement}${id}/`;
		return this.http.put(url,adv, httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}
	/*
		DELETE: Delete All Advertiment which checked box
		@author: TrangLe
	 */
	deleteAllAdvsSelected(adv_id): Observable<any> {
		const url = `${api.advertisement}`;
		let param = {
            adv_id: adv_id
        }
        console.log(param);
        let _options = new RequestOptions({
            headers: httpOptions.headers,
            body: JSON.stringify(param)
        });
		return this.http.delete(url, _options)
		.map((res: Response) => res.json()).catch(this.handleError);
	}

	// Handle error
	handleError(error: Response) {
		return Observable.throw(error);
	}
}
