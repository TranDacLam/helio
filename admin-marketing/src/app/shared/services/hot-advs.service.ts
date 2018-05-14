import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { HotAdvs } from '../../shared/class/hot-advs';
import { api } from '../utils/api';
import { get_token } from '../auth/auth-token';

@Injectable()
export class HotAdvsService {

    constructor(private http: Http) {
       
    }

    /*
      GET: Get All Banner Hot_Advs Service
      @author: TrangLe  
    */
    getAllHotAdvs(): Observable<HotAdvs[]> {
        let url = `${api.hot_advs}`
        return this.http.get(url ).map((res: Response) => res.json());
    }

    /*
        GET: Get Hot Ads By ID
        @author: Trangle
     */
    getHotAdsById(id: number): Observable<HotAdvs> {
        let url =  `${api.hot_advs}${id}/`;
        return this.http.get(url).map((res:Response) => res.json());
    }
    /*
      POST: Create a New Hot_Advs
      @author: TrangLe
    */

    CreateHotAdvs(hotAdvsFormData: FormData): Observable<any> {

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', api.hot_advs);
            let token = get_token();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
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
            let token = get_token();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
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
        return this.http.delete(url).map((res: Response) => res.json());
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
            body: JSON.stringify(param)
        });

        return this.http.delete(url, _options).map((res: Response) => res.json());
    }
}