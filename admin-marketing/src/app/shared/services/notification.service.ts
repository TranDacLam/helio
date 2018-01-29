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

    // get all notification
    getNotifications(): Observable<any> {
        return this.http.get(this.url_notification).map((res: Response) => res.json()).catch(this.handleError);
    }

    getNotification(id): Observable<Notification> {
        let url_noti_detail = `${this.url_notification}${id}`
        return this.http.get(this.url_notification).map((res: Response) => res.json()).catch(this.handleError);
    }

    // Delete all notifiaction selected
    onDelelteNoti(notifications_del): Observable<any>{
        
    }

    // Get user notification
    getUserNotification(id):Observable<any> {
        let url_user_noti_detail = `${this.url_user_notification}?id=${id}`
        return this.http.get(url_user_noti_detail).map((res: Response) => res.json()).catch(this.handleError);
    }


    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
