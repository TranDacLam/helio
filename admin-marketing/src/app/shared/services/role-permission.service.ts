import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import { api } from '../utils/api';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class RolePermissionService {

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
        function getRolePermission(): Get all Category Notifications
        author: Lam
    */
    getRolePermission(): Observable<any> {
        return this.http.get(api.user_role, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function getRole(): Get all Category Notifications
        author: Lam
    */
    getRole(): Observable<any> {
        return this.http.get(api.role_list, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    saveRolePermission(list_role_permission): Observable<any> {
        let body = JSON.stringify(list_role_permission);
        return this.http.post(api.user_role, body, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
