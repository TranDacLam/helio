import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

@Injectable()
export class EventService {

    private urlEvent= api.event;
    private urlEventList= api.event_list;
    
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
    getEvents(): Observable<any>{
        return this.http.get(this.urlEventList, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    getEvent(id: number): Observable<any>{
        let url_detail_event = `${this.urlEvent}${id}`;
        return this.http.get(url_detail_event, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
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
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(this.urlEventList, _options).map((res: Response) => res.json()).catch(this.handleError);
    }

    addEvent(value: FormData): Observable<any>{
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.open('POST', api.event);
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

    updateEvent(value: FormData, id: number): Observable<any>{
        let url_update_event = `${this.urlEvent}${id}/`;
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.open('PUT', url_update_event);
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

    onDelEvent(id: number): Observable<any>{
        const url_del_event = `${this.urlEvent}${id}/`;
        return this.http.delete(url_del_event, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
