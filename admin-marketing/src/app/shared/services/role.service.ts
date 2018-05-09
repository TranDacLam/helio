import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { api } from '../utils/api';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { Role } from '../../shared/class/role';

@Injectable()
export class RoleService {

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
        GET: Get All Roles From Server
        @author: TrangLe
    */
    getAllRoles(): Observable<Role[]> {
        let url = `${api.role}`;
        return this.http.get(url, this.httpOptions).map((res: Response) => res.json());
    }
}
