import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class FaqService {

    private urlFaq = api.faq;
    private urlFaqList = api.faq_list;

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
        function getEvents(): Get all notification
        author: Lam
    */
    getFaqs(): Observable<any>{
        return this.http.get(this.urlFaqList, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    getFaq(id: number): Observable<any>{
        let url_detail_faq = `${this.urlFaq}${id}`;
        return this.http.get(url_detail_faq, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelEventSelect(): Delete all event selected
        author: Lam
    */
    onDelFaqSelect(arr): Observable<any>{
        let param = {
            list_id: arr
        }

        let _options = new RequestOptions({
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(this.urlFaqList, _options).map((res: Response) => res.json()).catch(this.handleError);
    }

    addFaq(value): Observable<any>{
        let body = JSON.stringify(value); // String payload
        return this.http.post(this.urlFaq, body, this.httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    updateFaq(value, id: number): Observable<any>{
        let url_update_faq = `${this.urlFaq}${id}/`;
        return this.http.put(url_update_faq, JSON.stringify(value), this.httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    onDelFaq(id: number): Observable<any>{
        const url_del_faq = `${this.urlFaq}${id}/`;
        return this.http.delete(url_del_faq, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
