import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class FaqService {

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
    getFaqs(lang): Observable<any>{
        const url_getFaqs = `${env.api_domain_root}/${lang}/api/${api.faq_list}`;
        return this.http.get(url_getFaqs, this.httpOptions).map((res: Response) => res.json());
    }

    getFaq(id: number, lang): Observable<any>{
        const url_getFaq = `${env.api_domain_root}/${lang}/api/${api.faq}${id}/`;
        return this.http.get(url_getFaq, this.httpOptions).map((res: Response) => res.json());
    }

    /* 
        function onDelEventSelect(): Delete all event selected
        author: Lam
    */
    onDelFaqSelect(arr, lang): Observable<any>{
        const url_onDelFaqSelect = `${env.api_domain_root}/${lang}/api/${api.faq_list}`;

        let param = {
            list_id: arr
        }

        let _options = new RequestOptions({
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(url_onDelFaqSelect, _options).map((res: Response) => res.json());
    }

    addFaq(value, lang): Observable<any>{
        const url_addFaq = `${env.api_domain_root}/${lang}/api/${api.faq}`;
        let body = JSON.stringify(value); // String payload
        return this.http.post(url_addFaq, body, this.httpOptions)
            .map((res: Response) => res.json());
    }

    updateFaq(value, id: number, lang): Observable<any>{
        const url_updateFaq = `${env.api_domain_root}/${lang}/api/${api.faq}${id}/`;
        return this.http.put(url_updateFaq, JSON.stringify(value), this.httpOptions)
            .map((res: Response) => res.json());
    }

    onDelFaq(id: number, lang): Observable<any>{
        const url_onDelFaq = `${env.api_domain_root}/${lang}/api/${api.faq}${id}/`;
        return this.http.delete(url_onDelFaq, this.httpOptions).map((res: Response) => res.json());
    }

}
