import { Injectable } from '@angular/core';

import { Http, Headers, Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'; 
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { api } from '../utils/api';

import { Denomination } from '../../shared/class/denomination';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DenominationService {

	constructor(private http: HttpClient) { }

	/*
		GET: Get All Denomination From Server
		@author: TrangLe
	 */
	getAllDenomination(): Observable<Denomination[]> {
    	let urlDeno = `${api.denomination}`;
		return this.http.get<Denomination[]>(urlDeno).catch(this.handleError)
	}

	/*
		POST: Create a new denomination
		Author: TrangLe
	*/
	createDenomination(deno: Denomination): Observable<Denomination> {
    	let urlDeno = `${api.denomination}`;
		return this.http.post<Denomination>(urlDeno, deno, httpOptions).catch(this.handleError)
	}

	/*
		DELETE: Delete All Denomination Which Checked box
	 */
  	deleteAllDenosSelected(deno_id: Denomination[]): Observable<Denomination[]> {
    	const url = `${api.denomination}?deno_id=${deno_id}`;
    	return this.http.delete<Denomination[]>(url, httpOptions)
    		.catch(this.handleError)
  	}

	/* 
		Handle error
	*/
	handleError(error:Response) {
		return Observable.throw(error);
	}
}
