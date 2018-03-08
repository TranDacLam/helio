import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Role } from '../class/role';
import { User } from '../class/user';
import { Http, Response, Headers } from '@angular/http';
import { catchError, map, tap } from 'rxjs/operators';
import {RequestOptions, Request, RequestMethod, RequestOptionsArgs} from '@angular/http'
import { api } from '../utils/api';


const httpOptions = {
  headers: new Headers({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserPermissionService {

  constructor( private http: Http ) { }

  private role_list = api.role_list;
  private users_role = api.users_role;


  	getRoles(): Observable<Role[]>{
  		return this.http.get(this.role_list, httpOptions ).map((res: Response) => res.json()).catch(this.handleError);
  	}
  	getUsers(): Observable<User[]>{
  		return this.http.get(this.role_list, httpOptions ).map((res: Response) => res.json()).catch(this.handleError);
  	}

	// throw error
	handleError(error: Response) {
		return Observable.throw(error);
	}
}
