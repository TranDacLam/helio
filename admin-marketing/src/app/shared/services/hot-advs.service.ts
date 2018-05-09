import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { HotAdvs } from '../../shared/class/hot-advs';
import { api } from '../utils/api';

@Injectable()
export class HotAdvsService {

    httpOptions: any;
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
      GET: Get All Banner Hot_Advs Service
      @author: TrangLe  
    */
    getAllHotAdvs(): Observable<HotAdvs[]> {
        let url = `${api.hot_advs}`
        return this.http.get(url, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /*
        GET: Get Hot Ads By ID
        @author: Trangle
     */
    getHotAdsById(id: number): Observable<HotAdvs> {
        let url =  `${api.hot_advs}${id}/`;
        return this.http.get(url, this.httpOptions).map((res:Response) => res.json()).catch(this.handleError);
    }
    /*
      POST: Create a New Hot_Advs
      @author: TrangLe
    */

    CreateHotAdvs(hotAdvsFormData: FormData): Observable<any> {

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', api.hot_advs);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(hotAdvsFormData);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr);
                    }
                }
            }
        });
    }
    /*
        PUT: Update Hot Ads Detail
        @author: Trangle
     */
    updateHotAds(hotAdvsFormData: FormData, id: number): Observable<any> {

        return Observable.create(observer => {
            let url = `${api.hot_advs}${id}/`
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', url);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(hotAdvsFormData);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if(xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr);
                    }
                }
            }
        });
    }
    /*
        DELETE: Delete hot ads by id
        @author: Trangle
     */
    deleteHotAdsById(id: number): Observable<HotAdvs> {
        let url =  `${api.hot_advs}${id}/`;
        return this.http.delete(url, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    } 
    /*
        DELETE:  Delete multi hot_ads
        @author: Trangle
     */
    deleteHotAdvsSelected(hot_advs_id): Observable<any> {
        let url = `${api.hot_advs}`;
        let param = {
            hot_advs_id: hot_advs_id
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