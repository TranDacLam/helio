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
export class PromotionLabelService {

  	private urlPromotionLabel = `${api.promotion_label}`;

	constructor(private http: Http) 
	{
	}
	
	// Get All Promotion Label from server
	getPromotionLabels(): Observable<any>{
		return this.http.get(this.urlPromotionLabel).map((res: Response) => res.json()).catch(this.handleError);
	}

	// POST: Add new Promotion Label to the server 
	addPromotionLabel(proLabel): Observable<any> {
		let body = JSON.stringify(proLabel); // String payload
		return this.http.post(this.urlPromotionLabel, body, httpOptions)
			.map((res: Response) => res.json()).catch(this.handleError);	
	}

	getPromotionLabel(id: number): Observable<any>{
        let url_promotion_label = `${this.urlPromotionLabel}${id}`;
        return this.http.get(url_promotion_label).map((res: Response) => res.json()).catch(this.handleError);
    }

    /* 
        function onDelEventSelect(): Delete all event selected
        author: Lam
    */
    onDelPromotionLabelSelect(arr): Observable<any>{
        let param = {
            list_id: arr
        }

        let _options = new RequestOptions({
            headers: httpOptions.headers,
            body: JSON.stringify(param)
        });

        return this.http.delete(this.urlPromotionLabel, _options).map((res: Response) => res.json()).catch(this.handleError);
    }

    updatePromotionLabel(value, id): Observable<any>{
        let url_update_promotion_label = `${this.urlPromotionLabel}${id}/`;
        return this.http.put(url_update_promotion_label, JSON.stringify(value), httpOptions)
            .map((res: Response) => res.json()).catch(this.handleError);
    }

    onDelPromotionLabel(id): Observable<any>{
        const url_del = `${this.urlPromotionLabel}${id}/`;
        return this.http.delete(url_del, httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

	// exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
