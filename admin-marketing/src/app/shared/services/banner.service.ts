import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from "@angular/http";
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

const _headers = new Headers({
    'Content-Type': 'application/json'
});


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
      POST: Create a New Banner
      @author: TrangLe
    */
    CreateBanner(bannerForm: Banner): Observable<any> {
       let url_banner = `${api.banner}`;
       return this.http.post<Banner[]>(url_banner, bannerForm, httpOptions ).catch(this.handleError)
    }

    deleteBannerSelected(list_id_selected): Observable<any> {
        let options = new RequestOptions({
            headers: _headers,
            body: {
                list_id: JSON.stringify(list_id_selected)
            }
        });
        let url_banner = `${api.banner}`;
        
        return this.http.delete<Banner>(url_banner,options ).catch(this.handleError)

    }

  	/* 
      Handle error
    */
  	handleError(error: Response) {
  		return Observable.throw(error);
  	}

}
