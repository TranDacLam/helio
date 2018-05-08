import { Injectable } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';
import { VariableGlobals } from '../../shared/commons/variable_globals';


@Injectable()
export class AuthHttp extends Http {

    constructor(
        private backend: XHRBackend,
        private defaultOptions: RequestOptions,
        private router: Router,
        public variable_globals: VariableGlobals,
    ) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(url, options).catch((error: Response) => {
            switch (error.status) {
                case 401 || 403:
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('current_user');
                    localStorage.removeItem('time');
                    this.variable_globals.user_current = null;
                    this.router.navigate(['/login']);
                    return Observable.of(error);
                case 404:
                    return Observable.throw("HTTP 404 Not Found");
                case 0:
                    return Observable.throw("ERR_CONNECTION_REFUSED");
                case 500:
                    return Observable.throw("500 - Internal Server Error")
                default:
                    return Observable.throw(error);
            }
            
        });
    }
}