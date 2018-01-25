import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../class/user';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

const httpOptions = {
    headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LinkCardService {

    private url_app= "http://localhost:8000/helio/userapp/";
    private url_embed= "http://localhost:8000/helio/user/";

    constructor(private http: Http) { }

    getUserApp(id: number): Observable<User>{
        const url_app_id = `${this.url_app}${id}`;
        return this.http.get(url_app_id).map((res: Response) => res.json()).catch(this.handleError);
    }

    getUserEmbed(id: number): Observable<User>{
        const url_embed_id = `${this.url_embed}${id}`;
        return this.http.get(url_embed_id).map((res: Response) => res.json()).catch(this.handleError);
    }

    getAllUserApp(): Observable<User[]>{
        return this.http.get(this.url_app).map((res: Response) => res.json()).catch(this.handleError);
    }

    getAllUserEmbed(): Observable<User[]>{
        return this.http.get(this.url_embed).map((res: Response) => res.json()).catch(this.handleError);
    }

    updateUserApp(user_app: User, id: number): Observable<User>{
        const urlUser = `${this.url_app}${id}/`;
        return this.http.put(urlUser, JSON.stringify(user_app), httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    updateUserEmbed(user_embed: User): Observable<User>{     
        const id = user_embed.barcode;
        const urlUser = `${this.url_embed}${id}/`;
        return this.http.put(urlUser, JSON.stringify(user_embed), httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }


    private handleError(error: Response) {
        return Observable.throw(error.statusText);
    }

}
