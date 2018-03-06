import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { api } from '../utils/api';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { User} from '../../shared/class/user';

const httpOptions = {
	headers: new Headers({ 'Content-Type': 'application/json' })
}

@Injectable()
export class UserService {

  	constructor(private http: Http) { }

  	/*
		GET: Get All Users From Server
		@author: TrangLe
	 */
	getAllUsers(): Observable<User[]> {
    	let url = `${api.users}`;
		return this.http.get(url).map((res: Response) => res.json()).catch(this.handleError);
	}

	/*
		DELETE: Delete User Selected
		@author: Trangle
	*/

	deleteUserSelected(user_id): Observable<any> {
		let url = `${api.users}`;
		let param = {
			user_id: user_id
		};
		let _options = new RequestOptions({
			headers: httpOptions.headers,
			body: JSON.stringify(param)
		});
		return this.http.delete(url, _options).map((res: Response) => res.json()).catch(this.handleError);
	}
	/* 
      Handle error
    */
  	handleError(error: Response) {
  		return Observable.throw(error);
  	}
}
