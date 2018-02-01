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

    private url_notification= "http://localhost:8000/vi/api/notification/";
    private url_user_notification= "http://localhost:8000/api/user_notification/";

    constructor(private http: Http) { }

    /* 
        function getNotification(): Get notification by id
        author: Lam
    */
    getNotification(id: number): Observable<any> {
        let url_detail_noti = `${this.url_notification}${id}`;
        return this.http.get(url_detail_noti).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function getNotifications(): Get all notification
        author: Lam
    */
    getNotifications(): Observable<any> {
        let url_notification_list = "http://localhost:8000/api/notification_list/";
        return this.http.get(url_notification_list).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function addNoti(): add notification
        author: Lam
    */
    addNoti(noti: Notification): Observable<Notification>{
        return this.http.post(this.url_notification, JSON.stringify(noti), httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function updateNoti(): Update notification
        author: Lam
    */
    updateNoti(noti: Notification, id: number): Observable<Notification>{
        let url_update_noti = `${this.url_notification}${id}/`;
        return this.http.put(url_update_noti, JSON.stringify(noti), httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelNoti(): Delete notifiaction by id
        author: Lam
    */
    onDelNoti(id: number): Observable<any>{
        const url_del_noti = `${this.url_notification}${id}/`;
        return this.http.delete(url_del_noti, httpOptions).catch(this.handleError);
    }

    /* 
        function onDelelteNoti(): Delete all notifiaction selected
        author: Lam
    */
    onDelNotiSelect(notifications_del): Observable<any>{
        return;
    }

    /* 
        function onDelelteNoti(): Get user notification by id
        author: Lam
    */
    getUserNotification(id): Observable<any> {
        let url_user_noti_detail = `${this.url_user_notification}${id}`
        return this.http.get(url_user_noti_detail).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function updateUserNoti(): update user notification by array id
        author: Lam
    */
    updateUserNoti(user_noti): Observable<any>{
        return;
    }


    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
