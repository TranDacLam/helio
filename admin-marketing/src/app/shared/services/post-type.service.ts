import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

const httpOptions = {
    headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PostTypeService {

    private urlPostTypeLIst = api.post_type_list;

    constructor(private http: Http) { }

    /* 
        function getPosts(): Get all post
        author: Lam
    */
    getPostTypes(): Observable<any>{
        return this.http.get(this.urlPostTypeLIst).map((res: Response) => res.json()).catch(this.handleError);
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
