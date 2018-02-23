import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import { api } from '../utils/api';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

const httpOptions = {
    headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CategoryNotificationService {

    private url = api.category_notifications;

    constructor(private http: Http) { }

    /* 
        function getCategoryNotifications(): Get all Category Notifications
        author: Lam
    */
    getCategoryNotifications(): Observable<any> {
        return this.http.get(this.url).map((res: Response) => res.json()).catch(this.handleError);
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
