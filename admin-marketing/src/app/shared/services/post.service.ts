import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

@Injectable()
export class PostService {

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
    getPosts(lang): Observable<any>{
        const url_getPosts = `${env.api_domain_root}/${lang}/api/${api.post_list}`;
        return this.http.get(url_getPosts, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    getPost(id: number, lang): Observable<any>{
        const url_getPost = `${env.api_domain_root}/${lang}/api/${api.post}${id}/`;
        return this.http.get(url_getPost, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelHotSelect(): Delete all hot selected
        author: Lam
    */
    onDelPostSelect(arr, lang): Observable<any>{
        const url_onDelPostSelect = `${env.api_domain_root}/${lang}/api/${api.post_list}`;

        let param = {
            list_id: arr
        }

        let _options = new RequestOptions({
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(url_onDelPostSelect, _options).map((res: Response) => res.json()).catch(this.handleError);
    }

    addPost(value: FormData, lang): Observable<any>{
        const url_addPost = `${env.api_domain_root}/${lang}/api/${api.post}`;

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url_addPost);
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
        const url_updatePost = `${env.api_domain_root}/${lang}/api/${api.post}${id}/`;

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', url_updatePost);
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
        const url_onDelPost = `${env.api_domain_root}/${lang}/api/${api.post}${id}/`;
        return this.http.delete(url_onDelPost, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
