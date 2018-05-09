import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { api } from '../utils/api';

import { Denomination } from '../../shared/class/denomination';


@Injectable()
export class DenominationService {

	httpOptions: any;
	token: any = '';

	constructor(private http: Http) {
		this.token = localStorage.getItem('auth_token')

		this.httpOptions = {
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${this.token}`
			})
		};
	}

	/*
		GET: Get All Denomination From Server
		@author: TrangLe
	 */
	getAllDenomination(): Observable<Denomination[]> {
		let urlDeno = `${api.denomination}`;
		return this.http.get(urlDeno, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}

	/*
		GET: Get Denomination By Id
		@author: Trangle
	 */
	getDenominationById(id:number): Observable<Denomination> {
		let url = `${api.denomination}${id}/`;
		return this.http.get(url, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}
	/*
		POST: Create a new denomination
		Author: TrangLe
	*/
	createDenomination(deno: any): Observable<Denomination> {
		let urlDeno = `${api.denomination}`;
		return this.http.post(urlDeno, deno, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}

	/*
		PUT: Update Denomination Detail
		@author: Trangle
	 */
	updateDenomination(denomi, id:number): Observable<Denomination> {
		let url = `${api.denomination}${id}/`;
		return this.http.put(url, denomi, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}

	/*
		DELETE: Delete Denomination Detail
		@author: Trangle
	 */
	
	deleteDenominationByid(id:number): Observable<Denomination> {
		let url = `${api.denomination}${id}/`;
		return this.http.delete(url, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}

	/*
		DELETE: Delete All Denomination Which Checked box
	 */
	deleteAllDenosSelected(deno_id): Observable<any> {
		const url = `${api.denomination}`;
		let param = {
			deno_id: deno_id
		}
		let _options = new RequestOptions({
			headers: this.httpOptions.headers,
			body: JSON.stringify(param)
		});

		return this.http.delete(url, _options).map((res: Response) => res.json()).catch(this.handleError);
	}

	/* 
		Handle error
	*/
	handleError(error: Response) {
		return Observable.throw(error);
	}
}
