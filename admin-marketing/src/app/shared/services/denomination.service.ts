import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'; 
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { api } from '../utils/api';

import { Denomination } from '../../shared/class/denomination';

const httpOptions = {
	headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DenominationService {

	constructor(private http: Http) { }

	/*
		GET: Get All Denomination From Server
		@author: TrangLe
	 */
	getAllDenomination(): Observable<Denomination[]> {
    	let urlDeno = `${api.denomination}`;
		return this.http.get(urlDeno).map((res: Response) => res.json()).catch(this.handleError);
	}

	/*
		POST: Create a new denomination
		Author: TrangLe
	*/
	createDenomination(deno: Denomination): Observable<Denomination> {
    	let urlDeno = `${api.denomination}`;
		return this.http.post(urlDeno, deno, httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}

	/*
		DELETE: Delete All Denomination Which Checked box
	 */
  	deleteAllDenosSelected(deno_id): Observable<any> {
    	const url = `${api.denomination}`;
    	let param = {
            deno_id: deno_id
        }
        console.log(param);
        let _options = new RequestOptions({
            headers: httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(url, _options).map((res: Response) => res.json()).catch(this.handleError);
  	}

	/* 
		Handle error
	*/
	handleError(error:Response) {
		return Observable.throw(error);
	}
}
