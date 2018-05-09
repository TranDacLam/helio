import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

const httpOptions = {
    headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class GameService {
    
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
    getGames(lang): Observable<any>{
        const url_getGames = `${env.api_domain_root}/${lang}/api/${api.game_list}`;
        return this.http.get(url_getGames, this.httpOptions).map((res: Response) => res.json());
    }

    getGame(id: number, lang): Observable<any>{
        const url_getGame = `${env.api_domain_root}/${lang}/api/${api.game}${id}/`;
        return this.http.get(url_getGame, this.httpOptions).map((res: Response) => res.json());
    }

    /* 
        function onDelEventSelect(): Delete all event selected
        author: Lam
    */
    onDelGameSelect(arr, lang): Observable<any>{
        const url_onDelGameSelect = `${env.api_domain_root}/${lang}/api/${api.game_list}`;

        let param = {
            list_id: arr
        }

        let _options = new RequestOptions({
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(url_onDelGameSelect, _options).map((res: Response) => res.json());
    }

    addGame(value: FormData, lang): Observable<any>{
        const url_addGame = `${env.api_domain_root}/${lang}/api/${api.game}`;
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', url_addGame);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(value);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr);
                    }
                }
            }
        });
    }

    updateGame(value: FormData, id: number, lang): Observable<any>{
        const url_updateGame = `${env.api_domain_root}/${lang}/api/${api.game}${id}/`;
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', url_updateGame);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(value);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr);
                    }
                }
            }
        });
    }

    onDelGame(id, lang): Observable<any>{
        const url_onDelGame = `${env.api_domain_root}/${lang}/api/${api.game}${id}/`;
        return this.http.delete(url_onDelGame, this.httpOptions).map((res: Response) => res.json());
    }

}
