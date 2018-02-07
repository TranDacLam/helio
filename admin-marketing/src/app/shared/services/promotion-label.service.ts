import { Injectable } from '@angular/core';

import { Http, Headers, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'; 

import { PromotionLabel } from '../../shared/class/promotion-label';
import { api } from '../utils/api';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PromotionLabelService {

  	private urlPromotionLabel = `${api.promotion_label}`;

	constructor(private http: HttpClient) 
	{
	}
	
	// Get All Promotion Label from server
	getAllPromotionsLabel(): Observable<PromotionLabel[]>{
		return this.http.get<PromotionLabel[]>(this.urlPromotionLabel);
	}

	// POST: Add new Promotion Label to the server 
	addPromotionLabel(proLabel: PromotionLabel): Observable<PromotionLabel> {
		var body = JSON.stringify(proLabel); // String payload
		return this.http.post<PromotionLabel>(this.urlPromotionLabel, proLabel, httpOptions);		
	}

}
