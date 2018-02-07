import { Injectable } from '@angular/core';

import { Http, Headers, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'; 
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch'
import { api } from '../utils/api';

import { PromotionType } from '../../shared/class/promotion-type';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PromotionTypeService {

	private urlPromotionType = `${api.promotion_type}`;
  	constructor(private http: HttpClient) {
  	 }

  	// Get All Promotion Label from server
	getAllPromotionsType(): Observable<PromotionType[]>{
		return this.http.get<PromotionType[]>(this.urlPromotionType).catch(this.handleError);
	}

	// Handle error
	handleError(error: Response) {
	    return Observable.throw(error);
	}

}
