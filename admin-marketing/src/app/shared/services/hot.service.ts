import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class HotService {

    private urlHot = api.hot;
    private urlHotList = api.hot_list;

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
    getHots(): Observable<any>{
        return this.http.get(this.urlHotList, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    getHot(id: number): Observable<any>{
        let url_hot_id = `${this.urlHot}${id}`;
        return this.http.get(url_hot_id, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelHotSelect(): Delete all hot selected
        author: Lam
    */
    onDelHotSelect(arr): Observable<any>{
        let param = {
            list_id: arr
        }

        let _options = new RequestOptions({
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(this.urlHotList, _options).map((res: Response) => res.json()).catch(this.handleError);
    }

    addHot(value: FormData): Observable<any>{
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', api.hot);
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

    updateHot(value: FormData, id: number): Observable<any>{
        let url_update_hot = `${this.urlHot}${id}/`;
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', url_update_hot);
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

    onDelHot(id): Observable<any>{
        const url_del = `${this.urlHot}${id}/`;
        return this.http.delete(url_del, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
