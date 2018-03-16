import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

@Injectable()
export class PostService {

    private urlPost = api.post;
    private urlPostLIst = api.post_list;

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
    getPosts(): Observable<any>{
        return this.http.get(this.urlPostLIst, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    getPost(id: number): Observable<any>{
        let url_post_id = `${this.urlPost}${id}/`;
        return this.http.get(url_post_id, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
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
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(this.urlPostLIst, _options).map((res: Response) => res.json()).catch(this.handleError);
    }

    addPost(value: FormData): Observable<any>{
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', this.urlPost);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(value);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(JSON.parse(xhr.response));
                    }
                }
            }
        });
    }

    updatePost(value: FormData, id: number): Observable<any>{
        let url_update_post = `${this.urlPost}${id}/`;
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', url_update_post);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(value);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(JSON.parse(xhr.response));
                    }
                }
            }
        });
    }

    onDelPost(id: number): Observable<any>{
        const url_del = `${this.urlPost}${id}/`;
        return this.http.delete(url_del, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
