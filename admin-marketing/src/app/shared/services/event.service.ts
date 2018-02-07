import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

const httpOptions = {
    headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class EventService {

    constructor(private http: Http) { }

    /* 
        function getEvents(): Get all notification
        author: Lam
    */
    getEvents(): Observable<any>{
        let url_events = '';
        return this.http.get(url_events).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelEventSelect(): Delete all event selected
        author: Lam
    */
    onDelEventSelect(arr): Observable<any>{
        let url_del_events = '';
        return this.http.delete(url_del_events, httpOptions).catch(this.handleError);
    }

    addEvent(value): Observable<any>{
        return;
    }

    updateEvent(value, id): Observable<any>{
        return;
    }

    onDelNoti(id): Observable<any>{
        return;
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
