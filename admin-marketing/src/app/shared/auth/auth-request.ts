
import { Headers, Http, BaseRequestOptions, RequestOptionsArgs, RequestOptions } from '@angular/http';

const AUTH_HEADER_KEY = 'Authorization';
const AUTH_PREFIX = 'Bearer';

export class AuthRequestOptions extends BaseRequestOptions {
 
	headers = new Headers({
		'Content-Type': 'application/json'
	});

	merge(options?: RequestOptionsArgs): RequestOptions {
		const token = localStorage.getItem('auth_token');
		var newOptions = super.merge(options);
		newOptions.headers.set(AUTH_HEADER_KEY, `${AUTH_PREFIX} ${token}`);
		return newOptions;
	}

}