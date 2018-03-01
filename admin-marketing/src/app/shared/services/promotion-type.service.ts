import { Injectable } from '@angular/core';

import { Http, Headers, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
 
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch'
import { api } from '../utils/api';

import { PromotionType } from '../../shared/class/promotion-type';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PromotionTypeService {

  	constructor(private http: HttpClient) {
  	 }

  	/*
  		GET: Get All Promorion Type From Server
  		@author: TrangLe
  	 */
	getAllPromotionsType(): Observable<PromotionType[]>{
		let urlPromotionType = `${api.promotion_type}`;
		return this.http.get<PromotionType[]>(urlPromotionType).catch(this.handleError);
	}

	/*
		Handle error
	*/
	handleError(error: Response) {
	    return Observable.throw(error);
	}

}
