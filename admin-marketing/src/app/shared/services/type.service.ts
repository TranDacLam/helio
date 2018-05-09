import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class TypeService {

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
    getTypes(lang): Observable<any>{
        const url_getTypes = `${env.api_domain_root}/${lang}/api/${api.type_list}`;
        return this.http.get(url_getTypes, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error);
    }

}
