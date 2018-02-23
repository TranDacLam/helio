import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

const httpOptions = {
    headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HotService {

    constructor(private http: Http) { }

    /* 
        function getHots(): Get all hot
        author: Lam
    */
    getHots(): Observable<any>{
        let url_faqs = '';
        return this.http.get(url_faqs).map((res: Response) => res.json()).catch(this.handleError);
    }

    getHot(id: number): Observable<any>{
        return;
    }

    /* 
        function onDelHotSelect(): Delete all hot selected
        author: Lam
    */
    onDelHotSelect(arr): Observable<any>{
        let url_del_hots = '';
        return this.http.delete(url_del_hots, httpOptions).catch(this.handleError);
    }

    addHot(value): Observable<any>{
        return;
    }

    updateHot(value, id): Observable<any>{
        return;
    }

    onDelHot(id): Observable<any>{
        return;
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
