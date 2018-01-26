import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

import { User } from '../class/user';
import { Promotion } from '../class/promotion';

const _options = {
    headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PromotionService {

   	private user_promotion = "http://localhost:8000/api/user_promotion";
   	private promotion = "http://localhost:8000/api/promotion";

    constructor(private http: Http) { }

    getPromotionUsersDetail(id : string): Observable<User[]> {
        console.log(id);

        return this.http.get(this.user_promotion, { params: { 'id': id }}).map((res: Response) => res.json()).catch(this.handleError);
    }


    getAllPromotion() {
        return this.http.get(this.promotion).map((res: Response) => res.json()).catch(this.handleError);
    }

   
    private handleError(error: Response) {
        alert("errrr");
        return Observable.throw(error.statusText);
    }


}
