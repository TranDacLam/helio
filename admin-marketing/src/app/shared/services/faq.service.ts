import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

const httpOptions = {
    headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class FaqService {

    constructor(private http: Http) { }

    /* 
        function getEvents(): Get all notification
        author: Lam
    */
    getFaqs(): Observable<any>{
        let url_faqs = '';
        return this.http.get(url_faqs).map((res: Response) => res.json()).catch(this.handleError);
    }

    getFaq(id: number): Observable<any>{
        return;
    }

    /* 
        function onDelEventSelect(): Delete all event selected
        author: Lam
    */
    onDelFaqSelect(arr): Observable<any>{
        let url_del_faqs = '';
        return this.http.delete(url_del_faqs, httpOptions).catch(this.handleError);
    }

    addFaq(value): Observable<any>{
        return;
    }

    updateFaq(value, id): Observable<any>{
        return;
    }

    onDelFaq(id): Observable<any>{
        return;
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
