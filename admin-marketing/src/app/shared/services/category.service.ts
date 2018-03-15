import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class CategoryService {

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
        function getCategoryNotifications(): Get all Category Notifications
        author: Lam
    */
    getAllCategory(lang): Observable<any> {
        const url = `${env.api_domain_root}/${lang}/api/${api.category_list}`; 
        return this.http.get(url, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
