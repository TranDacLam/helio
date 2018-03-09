import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Notification } from '../class/notification';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class NotificationService {

    private url_notification = api.notification;
    private url_user_notification = api.user_notification;
    private url_notification_list = api.notification_list;

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
        function getNotification(): Get notification by id
        author: Lam
    */
    getNotification(id: number): Observable<any> {
        let url_detail_noti = `${this.url_notification}${id}`;
        return this.http.get(url_detail_noti, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function getNotifications(): Get all notification
        author: Lam
    */
    getNotifications(): Observable<any> {
        return this.http.get(this.url_notification_list, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function addNoti(): add notification
        author: Lam
    */
    addNoti(noti: FormData): Observable<any>{
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.open('POST', api.notification);
            xhr.send(noti);

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

    /* 
        function updateNoti(): Update notification
        author: Lam
    */
    updateNoti(noti: FormData, id: number): Observable<any>{
        let url_update_noti = `${this.url_notification}${id}/`;
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.open('PUT', url_update_noti);
            xhr.send(noti);

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

    /* 
        function onDelNoti(): Delete notifiaction by id
        author: Lam
    */
    onDelNoti(id: number): Observable<any>{
        const url_del_noti = `${this.url_notification}${id}/`;
        return this.http.delete(url_del_noti, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelelteNoti(): Delete all notifiaction selected
        author: Lam
    */
    onDelNotiSelect(notis_del): Observable<any>{
        let param = {
            list_notification_id: notis_del
        }

        let _options = new RequestOptions({
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(this.url_notification_list, _options).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelelteNoti(): Get user notification by id
        author: Lam
    */
    getUserNotification(id): Observable<any> {
        let url_user_noti_detail = `${this.url_user_notification}${id}`
        return this.http.get(url_user_noti_detail, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function updateUserNoti(): update user notification by array id
        author: Lam
    */
    updateUserNoti(id, user_noti): Observable<any>{
        let url_user_noti_detail = `${this.url_user_notification}${id}/`
        let param = {
            list_user_id: user_noti
        }
        return this.http.post(url_user_noti_detail, JSON.stringify(param), this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /*
        Function sendNotification(): send notification by notification_id
        @author: Lam
    */
    sendNotification(id: number){
        let param = {
            notification_id: id
        }
        return this.http.post(api.notification_push, JSON.stringify(param), this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }


    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
