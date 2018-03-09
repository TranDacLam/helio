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
export class GameService {

    private urlGame = api.game;
    private urlGameList = api.game_list;
    
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
    getGames(): Observable<any>{
        return this.http.get(this.urlGameList, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    getGame(id: number): Observable<any>{
        let url_detail_game = `${this.urlGame}${id}`;
        return this.http.get(url_detail_game, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelEventSelect(): Delete all event selected
        author: Lam
    */
    onDelGameSelect(arr): Observable<any>{
        let param = {
            list_id: arr
        }

        let _options = new RequestOptions({
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(this.urlGameList, _options).map((res: Response) => res.json()).catch(this.handleError);
    }

    addGame(value: FormData): Observable<any>{
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', api.game);
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

    updateGame(value: FormData, id: number): Observable<any>{
        let url_update_game = `${this.urlGame}${id}/`;
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', url_update_game);
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

    onDelGame(id): Observable<any>{
        const url_del_game = `${this.urlGame}${id}/`;
        return this.http.delete(url_del_game, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }


    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
