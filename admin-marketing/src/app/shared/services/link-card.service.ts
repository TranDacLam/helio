import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../class/user';
import { Customer } from '../class/customer';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

const httpOptions = {
    headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LinkCardService {

    private url_app= "http://localhost:8000/api/user/";
    private url_embed= "http://localhost:8000/api/customer/";

    constructor(private http: Http) { }

    // get email search
    getEmail(email){
        const url_get_email = `${this.url_app}?email=${email}`;
        return this.http.get(url_get_email).map((res: Response) => res.json()).catch(this.handleError);
    }

    // update user
    updateUserApp(user_app: User, id: number): Observable<User>{
        const urlUser = `${this.url_app}${id}/`;
        return this.http.put(urlUser, JSON.stringify(user_app), httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    // get barcode search
    getBarcode(barcode): Observable<Customer>{
        const url_get_barcode = `${this.url_embed}/?barcode=${barcode}`;
        return this.http.get(url_get_barcode).map((res: Response) => res.json()).catch(this.handleError);
    }

    // Update customer
    updateUserEmbed(user_embed: User): Observable<Customer>{     
        const id = user_embed.barcode;
        const urlUser = `${this.url_embed}${id}/`;
        return this.http.put(urlUser, JSON.stringify(user_embed), httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    // Get user
    getUserApp(id: number): Observable<User>{
        const url_app_id = `${this.url_app}${id}`;
        return this.http.get(url_app_id).map((res: Response) => res.json()).catch(this.handleError);
    }

    // Get customer
    getUserEmbed(id: number): Observable<Customer>{
        const url_embed_id = `${this.url_embed}${id}`;
        return this.http.get(url_embed_id).map((res: Response) => res.json()).catch(this.handleError);
    }


    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
