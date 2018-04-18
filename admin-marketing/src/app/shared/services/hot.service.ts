import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class HotService {

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
        function getHots(): Get all hot
        author: Lam
    */
    getHots(lang): Observable<any>{
        const url_getHots = `${env.api_domain_root}/${lang}/api/${api.hot_list}`;
        return this.http.get(url_getHots, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    getHot(id: number, lang): Observable<any>{
        const url_getHot = `${env.api_domain_root}/${lang}/api/${api.hot}${id}/`;
        return this.http.get(url_getHot, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelHotSelect(): Delete all hot selected
        author: Lam
    */
    onDelHotSelect(arr, lang): Observable<any>{
        const url_onDelHotSelect = `${env.api_domain_root}/${lang}/api/${api.hot_list}`;

        let param = {
            list_id: arr
        }

        let _options = new RequestOptions({
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(url_onDelHotSelect, _options).map((res: Response) => res.json()).catch(this.handleError);
    }

    addHot(value: FormData, lang): Observable<any>{
        const url_addHot = `${env.api_domain_root}/${lang}/api/${api.hot}`;

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url_addHot);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(value);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(JSON.parse(xhr.response));
                    }
                }
            }
        });
    }

    updateHot(value: FormData, id: number, lang): Observable<any>{
        const url_updateHot = `${env.api_domain_root}/${lang}/api/${api.hot}${id}/`;

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', url_updateHot);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(value);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(JSON.parse(xhr.response));
                    }
                }
            }
        });
    }

    onDelHot(id, lang): Observable<any>{
        const url_onDelHot = `${env.api_domain_root}/${lang}/api/${api.hot}${id}/`;
        return this.http.delete(url_onDelHot, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
