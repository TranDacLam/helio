import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
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
        return;
    }

    /* 
        function onDelEventSelect(): Delete all event selected
        author: Lam
    */
    onDelPromotionLabelSelect(arr): Observable<any>{
        let url_del_events = '';
        return this.http.delete(url_del_events, httpOptions).catch(this.handleError);
    }

    updatePromotionLabel(value, id): Observable<any>{
        return;
    }

    onDelPromotionLabel(id): Observable<any>{
        return;
    }

	// exception
    private handleError(error: Response) {
        return Observable.throw(error.json());
    }

}
