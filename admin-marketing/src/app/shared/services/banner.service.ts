import { Injectable } from '@angular/core';

import { Http, Headers, Response } from "@angular/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'; 
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { Banner } from '../../shared/class/banner';
import { api } from '../utils/api';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class BannerService {

  constructor(private http: HttpClient) { }

  	/*
        GET: Get All Banner From Service
        @author: TrangLe  
    */
  	getAllBanner(): Observable<Banner[]> {
  		let url_banner = `${api.banner}`
  		return this.http.get<Banner[]>(url_banner).catch(this.handleError)
  	}

  	/* 
      Handle error
    */
  	handleError(error: Response) {
  		return Observable.throw(error);
  	}

}
