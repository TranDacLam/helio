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
export class EventService {

    private urlEvent= api.event;

    constructor(private http: Http) { }

    /* 
        function getEvents(): Get all notification
        author: Lam
    */
    getEvents(): Observable<any>{
        return this.http.get(this.urlEvent).map((res: Response) => res.json()).catch(this.handleError);
    }

    getEvent(id: number): Observable<any>{
        return;
    }

    /* 
        function onDelEventSelect(): Delete all event selected
        author: Lam
    */
    onDelEventSelect(arr): Observable<any>{
        let param = {
            list_id: arr
        }

        let _options = new RequestOptions({
            headers: httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(this.urlEvent, _options).map((res: Response) => res.json()).catch(this.handleError);
    }

    addEvent(value): Observable<any>{
        return;
    }

    updateEvent(value, id): Observable<any>{
        return;
    }

    onDelEvent(id): Observable<any>{
        return;
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
