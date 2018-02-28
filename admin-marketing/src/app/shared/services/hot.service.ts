import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

const httpOptions = {
    headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HotService {

    private urlHot = api.hot;
    private urlHotList = api.hot_list;

    constructor(private http: Http) { }

    /* 
        function getHots(): Get all hot
        author: Lam
    */
    getHots(): Observable<any>{
        return this.http.get(this.urlHotList).map((res: Response) => res.json()).catch(this.handleError);
    }

    getHot(id: number): Observable<any>{
        let url_hot_id = `${this.urlHot}${id}`;
        return this.http.get(url_hot_id).map((res: Response) => res.json()).catch(this.handleError);
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
            headers: httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(this.urlHotList, _options).map((res: Response) => res.json()).catch(this.handleError);
    }

    addHot(value): Observable<any>{
        let body = JSON.stringify(value); // String payload
        return this.http.post(this.urlHot, body, httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    updateHot(value, id): Observable<any>{
        let url_update_hot = `${this.urlHot}${id}/`;
        return this.http.put(url_update_hot, JSON.stringify(value), httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    onDelHot(id): Observable<any>{
        const url_del = `${this.urlHot}${id}/`;
        return this.http.delete(url_del, httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
