import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Fee } from '../class/fee';
import { Customer } from '../class/customer';
// import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class FeeService {

  constructor( private http: HttpClient) { }



  private feeUrl = 'http://127.0.0.1:8000/vi/api/fees/';

  	getFees(): Observable<Fee[]>{
  		return this.http.get<Fee[]>(this.feeUrl).pipe(
      	catchError(this.handleError)
    	);
  	}
 	// throw error
	handleError(error: Response) {
		return Observable.throw(error);
	}
	createFee(fee: Fee ):Observable<Fee>{
  		return this.http.post<Fee>(this.feeUrl, fee, httpOptions ).pipe(catchError(this.handleError)
    );
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
