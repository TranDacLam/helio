import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Notification } from '../class/notification';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class NotificationService {

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
    getNotification(id: number, lang): Observable<any> {
        const url_getNotification = `${env.api_domain_root}/${lang}/api/${api.notification}${id}/`;
        return this.http.get(url_getNotification, this.httpOptions).map((res: Response) => res.json())
            .catch(this.handleError);
    }

    /* 
        function getNotifications(): Get all notification
        author: Lam
    */
    getNotifications(lang): Observable<any> {
        const url_getNotifications = `${env.api_domain_root}/${lang}/api/${api.notification_list}`;
        return this.http.get(url_getNotifications, this.httpOptions).map((res: Response) => res.json())
            .catch(this.handleError);
    }

    /* 
        function addNoti(): add notification
        author: Lam
    */
    addNoti(noti: FormData,lang): Observable<any>{
        const url_addNoti = `${env.api_domain_root}/${lang}/api/${api.notification}`;

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url_addNoti);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(noti);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr);
                    }
                }
            }
        });
    }

    /* 
        function updateNoti(): Update notification
        author: Lam
    */
    updateNoti(noti: FormData, id: number, lang): Observable<any>{
        const url_updateNoti = `${env.api_domain_root}/${lang}/api/${api.notification}${id}/`;

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', url_updateNoti);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(noti);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr);
                    }
                }
            }
        });
    }

    /* 
        function onDelNoti(): Delete notifiaction by id
        author: Lam
    */
    onDelNoti(id: number, lang): Observable<any>{
        const url_onDelNoti = `${env.api_domain_root}/${lang}/api/${api.notification}${id}/`;

        return this.http.delete(url_onDelNoti, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelelteNoti(): Delete all notifiaction selected
        author: Lam
    */
    onDelNotiSelect(notis_del, lang): Observable<any>{
        const url_onDelNotiSelect = `${env.api_domain_root}/${lang}/api/${api.notification_list}`;

        let param = {
            list_notification_id: notis_del
        }

        let _options = new RequestOptions({
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(url_onDelNotiSelect, _options).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelelteNoti(): Get user notification by id
        author: Lam
    */
    getUserNotification(id, lang): Observable<any> {
        const url_getUserNotification = `${env.api_domain_root}/${lang}/api/${api.user_notification}${id}/`;
        return this.http.get(url_getUserNotification, this.httpOptions).map((res: Response) => res.json())
            .catch(this.handleError);
    }

    /* 
        function updateUserNoti(): update user notification by array id
        author: Lam
    */
    updateUserNoti(id, user_noti, lang): Observable<any>{
        const url_updateUserNoti = `${env.api_domain_root}/${lang}/api/${api.user_notification}${id}/`;

        let param = {
            list_user_id: user_noti
        }
        return this.http.post(url_updateUserNoti, JSON.stringify(param), this.httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    /*
        Function sendNotification(): send notification by notification_id
        @author: Lam
    */
    sendNotification(id: number, lang){
        const url_sendNotification = `${env.api_domain_root}/${lang}/api/${api.notification_push}`;
        let param = {
            notification_id: id
        }
        return this.http.post(url_sendNotification, JSON.stringify(param), this.httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }


    // exception
    private handleError(error: Response) {
        return Observable.throw(error);
    }

}
