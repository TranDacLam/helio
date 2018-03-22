import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Fee } from '../class/fee';
import { Http, Response, Headers } from '@angular/http';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { RequestOptions, Request, RequestMethod, RequestOptionsArgs } from '@angular/http'
import { api } from '../utils/api';
import "rxjs/add/operator/catch";

@Injectable()
export class FeeService {

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

    private feeUrl = api.fee;
    private feeUrlList = api.fee_list;


    getFees(): Observable<Fee[]> {
        return this.http.get(this.feeUrlList, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    createFee(fee: Fee): Observable<Fee> {
        return this.http.post(this.feeUrl, fee, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }
    deleteListFee(list_id: number[]): Observable<Fee> {
        let options = new RequestOptions({
            body: { 'list_id': list_id },
            headers: this.httpOptions.headers,
            method: RequestMethod.Delete,
        })
        return this.http.delete(this.feeUrlList, options).map((res: Response) => res.json()).catch(this.handleError);
    }
    applyFee(id: number): Observable<Fee> {
        let feeDetailUrl = this.feeUrl + `${id}/`;
        return this.http.put(feeDetailUrl, null, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);

    }
    // exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}