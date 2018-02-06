import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

import { User } from '../class/user';
import { Promotion } from '../class/promotion';
import { api } from '../constants/api';

const _options = {
    headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PromotionService {

    constructor(private http: Http) { }

    getUsersPromotionDetail(id: number): Observable<any> {

        let url_user_promotion_detail = `${api.user_promotion}${id}`
        return this.http.get(url_user_promotion_detail).map((res: Response) => res.json()).catch(this.handleError);

    }

    getAllPromotion() {
        return this.http.get(api.promotion_list).map((res: Response) => res.json()).catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.statusText);
    }


}
