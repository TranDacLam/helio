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
		DELETE: Delete User By Id
		@author: Trangle
	 */
	getUserById(id:number):Observable<User> {
		const url = `${api.users}${id}/`;
		return this.http.get(url, httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}

	/*
		DELETE: Delete User By ID
		@author: Trangle
	*/
	deleteUserById(user: User): Observable<User> {
		const id = user.id;
		const url = `${api.user}${id}/`;
		return this.http.delete(url,httpOptions).map((res: Response) => res.json()).catch(this.handleError);
	}

	/*
		POST: Create User
		@author: TrangLe
	*/
	createUser(userFormData:FormData): Observable<any> {

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            // xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpZW1uZ3V5ZW5Adm9vYy52biIsIm9yaWdfaWF0IjoxNTE5Mjk1NDM1LCJ1c2VyX2lkIjozNjAsImVtYWlsIjoiZGllbW5ndXllbkB2b29jLnZuIiwiZXhwIjoxNTE5Mjk1NzM1fQ.z7K4Q6AiT0v6l2BMjrgjBXDqbFUMKTmVxfv4ASv70ng');
            xhr.open('POST', api.users);
            xhr.send(userFormData);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            }
        });
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
