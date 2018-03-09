import { Injectable } from '@angular/core';

import { Http, Headers, Response } from "@angular/http";

import { Observable } from 'rxjs/Observable';
 
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch'
import { api } from '../utils/api';

import { PromotionType } from '../../shared/class/promotion-type';


@Injectable()
export class PromotionTypeService {

	httpOptions:any;
	token: any = '';

  	constructor(private http: Http) {
  		this.token = localStorage.getItem('auth_token');

  		this.httpOptions = {
  			headers: new Headers({ 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            })
  		};
  	}
  	/*
  		GET: Get All Promorion Type From Server
  		@author: TrangLe
  	 */
	getAllPromotionsType(): Observable<PromotionType[]>{
		let urlPromotionType = `${api.promotion_type}`;
		return this.http.get(urlPromotionType, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}

	/*
		Handle error
	*/
	handleError(error: Response) {
	    return Observable.throw(error);
	}

}
