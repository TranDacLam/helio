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
            if ((error.status === 401 || error.status === 403)) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('current_user');
                this.variable_globals.user_current = null;
                this.router.navigate(['/login']);
                return Observable.of(error);
            }
            return Observable.throw(error);
        });
    }
}