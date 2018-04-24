import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from "@angular/http";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { Banner } from '../../shared/class/banner';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';


@Injectable()
export class BannerService {

    httpOptions: any;
    token: any = '';

    constructor(private http: Http) {
        this.token = localStorage.getItem('auth_token');

        this.httpOptions = {
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            })
        }
    }
    /*
      GET: Get All Banner From Service
      @author: TrangLe  
    */
    getAllBanner(lang): Observable<Banner[]> {
        let url_banner = `${env.api_domain_root}/${lang}/api/${api.banner}`;
        return this.http.get(url_banner, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /*
      GET: Get Banner By Id
      @author: TrangLe
    */
    getBannerById(id: number, lang): Observable<Banner> {
        // const url = `${api.banner}${id}/`;
        let url = `${env.api_domain_root}/${lang}/api/${api.banner}${id}/`
        return this.http.get(url, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }
    /*
        PUT: Update Banner By Id
        @author: Trangle
    */

    updateBanner(bannerFormData: FormData, id: number, lang): Observable<any> {
        // let url = `${api.banner}${id}/`;
        let url = `${env.api_domain_root}/${lang}/api/${api.banner}${id}/`
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', url);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(bannerFormData);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    }else if (xhr.status == 0){
                        observer.error("ERR_CONNECTION_REFUSED")
                    } else {
                        observer.error(JSON.parse(xhr.response));
                    }
                } 
            }
        });
    }
    /*
      POST: Create a New Banner
      @author: TrangLe
    */
    CreateBanner(bannerFormData: FormData, lang): Observable<any> {
        let url = `${env.api_domain_root}/${lang}/api/${api.banner}`;
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(bannerFormData);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    }else if (xhr.status == 0){
                        observer.error("ERR_CONNECTION_REFUSED")
                    } else {
                        observer.error(JSON.parse(xhr.response));
                    }
                }
            }
        });
    }
    deleteUserById(id: number, lang): Observable<any> {
        let url = `${env.api_domain_root}/${lang}/api/${api.banner}${id}/`
        return this.http.delete(url, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    deleteBannerSelected(banner_id, lang): Observable<any> {
        let url = `${env.api_domain_root}/${lang}/api/${api.banner}`;
        let param = {
            banner_id: banner_id
        }
        let _options = new RequestOptions({
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(url, _options).map((res: Response) => res.json()).catch(this.handleError);
    }
    /* 
      Handle error
    */
    handleError(error: Response) {
        return Observable.throw(error);
    }
}