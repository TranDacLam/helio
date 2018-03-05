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
     updateBanner(bannerFormData:FormData, id: number): Observable<any> { 
        let url = `${api.banner}${id}/`;
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            // xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpZW1uZ3V5ZW5Adm9vYy52biIsIm9yaWdfaWF0IjoxNTE5Mjk1NDM1LCJ1c2VyX2lkIjozNjAsImVtYWlsIjoiZGllbW5ndXllbkB2b29jLnZuIiwiZXhwIjoxNTE5Mjk1NzM1fQ.z7K4Q6AiT0v6l2BMjrgjBXDqbFUMKTmVxfv4ASv70ng');
            xhr.open('PUT', url);
            xhr.send(bannerFormData);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            }
        });
    }
    /*
      POST: Create a New Banner
      @author: TrangLe
    */
     CreateBanner(bannerFormData:FormData): Observable<any> {

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            // xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpZW1uZ3V5ZW5Adm9vYy52biIsIm9yaWdfaWF0IjoxNTE5Mjk1NDM1LCJ1c2VyX2lkIjozNjAsImVtYWlsIjoiZGllbW5ndXllbkB2b29jLnZuIiwiZXhwIjoxNTE5Mjk1NzM1fQ.z7K4Q6AiT0v6l2BMjrgjBXDqbFUMKTmVxfv4ASv70ng');
            xhr.open('POST', api.banner);
            xhr.send(bannerFormData);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            }
        });
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
