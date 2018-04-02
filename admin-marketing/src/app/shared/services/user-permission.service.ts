import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Role } from '../class/role';
import { User } from '../class/user';
import { Http, Response, Headers } from '@angular/http';
import { catchError, map, tap } from 'rxjs/operators';
import {RequestOptions, Request, RequestMethod, RequestOptionsArgs} from '@angular/http'
import { api } from '../utils/api';


@Injectable()
export class UserPermissionService {

    httpOptions: any;
    token: any = '';

    constructor(private http: Http) {
        this.token = localStorage.getItem('auth_token');

        this.httpOptions = {
            headers: new Headers({ 
                'Content-Type': 'application/json',
                'Authorization': `${this.token}`
            })
        };
    }
    private role_list = api.role_list;
    private users_role = api.users_role;
    private set_role = api.set_role;


    getRoles(): Observable<Role[]>{
        return this.http.get(this.role_list, this.httpOptions ).map((res: Response) => res.json()).catch(this.handleError);
    }

    getUserListByRole( id: number ): Observable<any>{
        let users_role_id = this.users_role + `?role_id=${id}`
        return this.http.get( users_role_id, this.httpOptions ).map((res: Response) => res.json()).catch(this.handleError);
    }
    setRoleUser( list_id: number[], role_id: any ): Observable<User[]>{
        let set_role_url = this.set_role + `${role_id}/`;
        let body = { 'list_id': list_id };
        return this.http.put( set_role_url, body, this.httpOptions ).map((res: Response) => res.json()).catch(this.handleError);
    }

    // throw error
    handleError(error: Response) {
        return Observable.throw(error);
    }
}
