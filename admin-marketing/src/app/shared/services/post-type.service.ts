import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class PostTypeService {

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
        function getPosts(): Get all post
        author: Lam
    */
    getPostTypes(lang): Observable<any>{
        const url = `${env.api_domain_root}/${lang}/api/${api.post_type_list}`;
        return this.http.get(url, this.httpOptions).map((res: Response) => res.json());
    }

}
