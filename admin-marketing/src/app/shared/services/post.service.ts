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
export class PostService {

    private urlPost = api.post;

    constructor(private http: Http) { }

    /* 
        function getPosts(): Get all post
        author: Lam
    */
    getPosts(): Observable<any>{
        return this.http.get(this.urlPost).map((res: Response) => res.json()).catch(this.handleError);
    }

    getPost(id: number): Observable<any>{
        let url_post_id = `${this.urlPost}${id}`;
        return this.http.get(url_post_id).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelHotSelect(): Delete all hot selected
        author: Lam
    */
    onDelPostSelect(arr): Observable<any>{
        let param = {
            list_id: arr
        }

        let _options = new RequestOptions({
            headers: httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(this.urlPost, _options).map((res: Response) => res.json()).catch(this.handleError);
    }

    addPost(value): Observable<any>{
        let body = JSON.stringify(value); // String payload
        return this.http.post(this.urlPost, body, httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    updatePost(value, id): Observable<any>{
        let url_update_post = `${this.urlPost}${id}/`;
        return this.http.put(url_update_post, JSON.stringify(value), httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    onDelPost(id): Observable<any>{
        const url_del = `${this.urlPost}${id}/`;
        return this.http.delete(url_del, httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
