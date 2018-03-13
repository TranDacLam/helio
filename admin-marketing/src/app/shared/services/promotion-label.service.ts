import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";


@Injectable()
export class PromotionLabelService {

  	private urlPromotionLabel = `${api.promotion_label}`;
    private urlPromotionLabelList = `${api.promotion_label_list}`;

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
        function getPromotionLabels(): Get all promotion labels
        author: Lam
    */
	getPromotionLabels(): Observable<any>{
		return this.http.get(this.urlPromotionLabelList, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}

    /* 
        function addPromotionLabel(): add promotion labels
        author: Lam
    */ 
	addPromotionLabel(proLabel): Observable<any> {
		let body = JSON.stringify(proLabel); // String payload
		return this.http.post(this.urlPromotionLabel, body, this.httpOptions)
			.map((res: Response) => res.json()).catch(this.handleError);	
	}

    /* 
        function getPromotionLabel(): get promotion label by id
        author: Lam
    */ 
	getPromotionLabel(id: number): Observable<any>{
        let url_promotion_label = `${this.urlPromotionLabel}${id}`;
        return this.http.get(url_promotion_label, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelEventSelect(): Delete all promotion label selected
        author: Lam
    */
    onDelPromotionLabelSelect(arr): Observable<any>{
        let param = {
            list_id: arr
        }

        let _options = new RequestOptions({
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(this.urlPromotionLabelList, _options).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function updatePromotionLabel(): update promotion label by id
        author: Lam
    */
    updatePromotionLabel(value, id: number): Observable<any>{
        let url_update_promotion_label = `${this.urlPromotionLabel}${id}/`;
        return this.http.put(url_update_promotion_label, JSON.stringify(value), this.httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelEventSelect(): Delete promotion label by id
        author: Lam
    */
    onDelPromotionLabel(id: number): Observable<any>{
        const url_del = `${this.urlPromotionLabel}${id}/`;
        return this.http.delete(url_del, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

	// exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
