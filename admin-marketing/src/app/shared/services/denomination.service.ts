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

	private urlDeno = `${api.denomination}`;

  	constructor(private http: HttpClient) { }

  	// Get all Denomination
  	getAllDenomination(): Observable<Denomination[]> {
  		return this.http.get<Denomination[]>(this.urlDeno).catch(this.handleError)
  	}

  	// POST: Create a new denomination
  	createDenomination(deno: Denomination): Observable<Denomination> {
  		return this.http.post<Denomination>(this.urlDeno, deno, httpOptions).catch(this.handleError)
  	}

    deleteAllDenosSelected(deno_id: Denomination[]): Observable<Denomination[]> {
      const url = `${this.urlDeno}?deno_id=${deno_id}`;
      return this.http.delete<Denomination[]>(url, httpOptions)
      .catch(this.handleError)
    }

  	// Handle error
  	handleError(error:Response) {
  		return Observable.throw(error);
  	}
}
