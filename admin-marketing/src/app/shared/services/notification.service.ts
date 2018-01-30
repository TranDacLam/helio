import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Notification } from '../class/notification';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

const httpOptions = {
    headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class NotificationService {

    private url_notification= "http://localhost:8000/api/notification/";
    private url_user_notification= "http://localhost:8000/api/user_notification/";

    constructor(private http: Http) { }

    /* 
        function getNotifications(): Get all notification
        author: Lam
    */
    getNotifications(): Observable<any> {
        return this.http.get(this.url_notification).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function getNotification(): Get notification by id
        author: Lam
    */
    getNotification(id): Observable<Notification> {
        let url_noti_detail = `${this.url_notification}${id}`
        return this.http.get(this.url_notification).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelelteNoti(): Delete all notifiaction selected
        author: Lam
    */
    onDelelteNoti(notifications_del): Observable<any>{
        
    }

    /* 
        function onDelelteNoti(): Get user notification by id
        author: Lam
    */
    getUserNotification(id):Observable<any> {
        let url_user_noti_detail = `${this.url_user_notification}?id=${id}`
        return this.http.get(url_user_noti_detail).map((res: Response) => res.json()).catch(this.handleError);
    }


    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
