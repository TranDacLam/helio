import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { api } from '../utils/api';
import { env } from './../../../environments/environment';
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
	getPromotionLabels(lang): Observable<any>{
        const url_getPromotionLabels = `${env.api_domain_root}/${lang}/api/${api.promotion_label_list}`;
		return this.http.get(url_getPromotionLabels, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}

    /* 
        function addPromotionLabel(): add promotion labels
        author: Lam
    */ 
	addPromotionLabel(proLabel, lang): Observable<any> {
        const url_addPromotionLabel = `${env.api_domain_root}/${lang}/api/${api.promotion_label}`;
		let body = JSON.stringify(proLabel); // String payload
		return this.http.post(url_addPromotionLabel, body, this.httpOptions)
			.map((res: Response) => res.json()).catch(this.handleError);	
	}

    /* 
        function getPromotionLabel(): get promotion label by id
        author: Lam
    */ 
	getPromotionLabel(id: number, lang): Observable<any>{
        const url_getPromotionLabel = `${env.api_domain_root}/${lang}/api/${api.promotion_label}${id}/`;
        return this.http.get(url_getPromotionLabel, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelEventSelect(): Delete all promotion label selected
        author: Lam
    */
    onDelPromotionLabelSelect(arr, lang): Observable<any>{
        const url_onDelPromotionLabelSelect = `${env.api_domain_root}/${lang}/api/${api.promotion_label_list}`;

        let param = {
            list_id: arr
        }

        let _options = new RequestOptions({
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(url_onDelPromotionLabelSelect, _options).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function updatePromotionLabel(): update promotion label by id
        author: Lam
    */
    updatePromotionLabel(value, id: number, lang): Observable<any>{
        const url_updatePromotionLabel = `${env.api_domain_root}/${lang}/api/${api.promotion_label}${id}/`;
        return this.http.put(url_updatePromotionLabel, JSON.stringify(value), this.httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelEventSelect(): Delete promotion label by id
        author: Lam
    */
    onDelPromotionLabel(id: number, lang): Observable<any>{
        const url_onDelPromotionLabel = `${env.api_domain_root}/${lang}/api/${api.promotion_label}${id}/`;
        return this.http.delete(url_onDelPromotionLabel, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

	// exception
    private handleError(error: Response) {
        return Observable.throw(error);
    }

}
