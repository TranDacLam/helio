import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from "@angular/http";

import { Observable } from 'rxjs/Observable'; 
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { api } from '../utils/api';
import { Advertisement } from '../../shared/class/advertisement';

@Injectable()
export class AdvertisementService {

	httpOptions: any;
	token: any = '';

	constructor(private http: Http){
		this.token = localStorage.getItem('auth_token');

		this.httpOptions = {
            headers: new Headers({ 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            })
        };
	}
	/*
		GET: Get All Advertiment From Service
		@author: TrangLe
	 */
	getAllAdvertisement(): Observable<any>{
		let urlAdv = `${api.advertisement}`;
		return this.http.get(urlAdv, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}

	/*
		POST: Add Advertiment
		@author: TrangLe
	 */ 
	addAdvertisement(adv: Advertisement): Observable<Advertisement> {
		let urlAdv = `${api.advertisement}`;
		return this.http.post(urlAdv, adv, this.httpOptions)
		.map((res: Response) => res.json()).catch(this.handleError);		
	}

	/*
		GET: Get Advertiment By Id
		@author: TrangLe
	 */
	getAdvertisement(id: number): Observable<Advertisement> {
		const url = `${api.advertisement}${id}/`;
		return this.http.get(url, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}

	deleteAdvById(adv: Advertisement): Observable<Advertisement> {
		const id = adv.id;
		const url = `${api.advertisement}${id}/`;
		return this.http.delete(url,this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}
	
	/*
		POST: Update detail Advertiment
		@author: TrangLe
	 */
	updateAdv(adv, id:number): Observable<Advertisement> {
		// const id = adv.id;
		var body = JSON.stringify(adv);
		const url = `${api.advertisement}${id}/`;
		return this.http.put(url,body, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
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
        let _options = new RequestOptions({
            headers: this.httpOptions.headers,
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
