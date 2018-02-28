import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Fee } from '../class/fee';
// import { Customer } from '../class/customer';
import { Http, Response, Headers } from '@angular/http';
// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import "rxjs/add/operator/catch";
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import {RequestOptions, Request, RequestMethod, RequestOptionsArgs} from '@angular/http'
import { api } from '../utils/api';


const httpOptions = {
  headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class FeeService {

  constructor( private http: Http) { }



  private feeUrl = api.fee;
  private feeUrlList = api.fee_list;


  	getFees(): Observable<Fee[]>{
  		return this.http.get(this.feeUrlList, httpOptions ).map((res: Response) => res.json()).catch(this.handleError);
  	}
 	// throw error
	handleError(error: Response) {
		return Observable.throw(error);
	}
	createFee(fee: Fee ):Observable<Fee>{
  		return this.http.post(this.feeUrl, fee, httpOptions ).map((res: Response) => res.json()).catch(this.handleError);
  	}
  	deleteListFee(list_id: number[] ):Observable<Fee>{
		let options = new RequestOptions({ 
		    body: {'list_id': list_id},
		    headers: httpOptions.headers,
		    method: RequestMethod.Delete,
		  })
  		return this.http.delete( this.feeUrlList, options  ).map((res: Response) => res.json()).catch(this.handleError);
	}
	applyFee(id: number):Observable<Fee>{
		// let feeUrl = `http://127.0.0.1:8000/vi/api/fee/${id}/`;
		let feeDetailUrl = this.feeUrl + `${id}/`;
  		return this.http.put( feeDetailUrl, httpOptions  ).map((res: Response) => res.json()).catch(this.handleError);

	}


 //  private handleError<T> (operation = 'operation', result?: T) {
	//   return (error: any): Observable<T> => {

	//     // TODO: send the error to remote logging infrastructure
	//     console.error(error); // log to console instead

	//     // Let the app keep running by returning an empty result.
	//     return of(result as T);
	//   };
	// }
}