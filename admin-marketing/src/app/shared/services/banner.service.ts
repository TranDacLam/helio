import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from "@angular/http";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { Banner } from '../../shared/class/banner';
import { api } from '../utils/api';

const httpOptions = {
	headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class BannerService {

  constructor(private http: Http) { }

  	/*
      GET: Get All Banner From Service
      @author: TrangLe  
    */
  	getAllBanner(): Observable<Banner[]> {
  		let url_banner = `${api.banner}`
  		return this.http.get(url_banner).map((res: Response) => res.json()).catch(this.handleError);
  	}

    /*
      GET: Get Banner By Id
      @author: TrangLe
     */
    getBannerById(id: number): Observable<Banner> {
      const url = `${api.banner}${id}/`;
      return this.http.get(url, httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }
    /*
        PUT: Update Banner By Id
        @author: Trangle
     */
    updateBanner(banner: Banner, id:number): Observable<Banner> {
        const url = `${api.feedback}${id}/`;
        return this.http.put(url, banner, httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }
    /*
      POST: Create a New Banner
      @author: TrangLe
    */
    CreateBanner(bannerForm: Banner): Observable<any> {
       let url_banner = `${api.banner}`;
       return this.http.post(url_banner, bannerForm, httpOptions ).map((res: Response) => res.json()).catch(this.handleError);
    }

    deleteBannerSelected(banner_id): Observable<any> {
      let url_banner = `${api.banner}`;
      let param = {
          banner_id: banner_id
        }
      let _options = new RequestOptions({
        headers: httpOptions.headers,
        body: JSON.stringify(param)
      });

      return this.http.delete(url_banner,_options ).map((res: Response) => res.json()).catch(this.handleError);
    }

  	/* 
      Handle error
    */
  	handleError(error: Response) {
  		return Observable.throw(error);
  	}

}
