import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../class/user';
import { Customer } from '../class/customer';
import { Http, Response, Headers } from '@angular/http';
import { api } from '../utils/api';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

const httpOptions = {
    headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LinkCardService {

    private url_app= api.user;
    private url_embed= api.user_embed;
    private url_relate = api.relate;
    private url_delete_relate = api.delete_relate;

    constructor(private http: Http) { }

    /* 
        function getEmail(): Get user by email
        author: Lam
    */
    getEmail(email){
        const url_get_email = `${this.url_app}?email=${email}`;
        return this.http.get(url_get_email).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function updateUserApp(): Update user
        author: Lam
    */
    updateUserApp(user_app: User, id: number): Observable<User>{
        const urlUser = `${this.url_app}${id}/`;
        return this.http.put(urlUser, JSON.stringify(user_app), httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function getBarcode(): Get user embed by barcode
        author: Lam
    */
    getBarcode(barcode): Observable<any>{
        const url_get_barcode = `${this.url_embed}?barcode=${barcode}`;
        return this.http.get(url_get_barcode).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function updateUserEmbed(): Update user embed
        author: Lam
    */
    updateUserEmbed(user_embed: User): Observable<Customer>{     
        const id = user_embed.barcode;
        const urlUser = `${this.url_embed}${id}/`;
        return this.http.put(urlUser, JSON.stringify(user_embed), httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function getUserApp(): Get user by id
        author: Lam
    */
    getUserApp(id: number): Observable<User>{
        const url_app_id = `${this.url_app}${id}`;
        return this.http.get(url_app_id).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function getUserEmbed(): Get user embed by id
        author: Lam
    */
    getUserEmbed(id: number): Observable<Customer>{
        const url_embed_id = `${this.url_embed}${id}`;
        return this.http.get(url_embed_id).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function delLinkCard(): Delete link card by id
        author: Lam
    */
    delLinkCard(id: number): Observable<any>{
        const url_del_linkcard = `${this.url_delete_relate}${id}`;
        return this.http.delete(url_del_linkcard, httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function relate(): check link card and create link card
        author: Lam
    */
    relate(email, barcode): Observable<any>{
        let obj_relate = {email: email, barcode: barcode};
        return this.http.post(this.url_relate, obj_relate, httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }


    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
