import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { api } from '../utils/api';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { Role } from '../../shared/class/role';

const httpOptions = {
	headers: new Headers({ 'Content-Type': 'application/json' })
}

@Injectable()
export class RoleService {

  	constructor(private http: Http) { }

  	/*
		GET: Get All Roles From Server
		@author: TrangLe
	 */
	getAllRoles(): Observable<Role[]> {
    	let url = `${api.role}`;
		return this.http.get(url).map((res: Response) => res.json()).catch(this.handleError);
	}

	/* 
      Handle error
    */
  	handleError(error: Response) {
  		return Observable.throw(error);
  	}

}