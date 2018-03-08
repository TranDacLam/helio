import { Injectable } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { HotAdvs } from '../../shared/class/hot-advs';
import { api } from '../utils/api';


const httpOptions = {
	headers: new Headers({ 'Content-Type': 'application/json' })
};
@Injectable()
export class HotAdvsService {

  	constructor(private http: Http) { }


  	/*
      GET: Get All Banner Hot_Advs Service
      @author: TrangLe  
    */
  	getAllHotAdvs(): Observable<HotAdvs[]> {
  		let url = `${api.hot_advs}`
  		return this.http.get(url).map((res: Response) => res.json()).catch(this.handleError);
  	}

  	/*
      POST: Create a New Hot_Advs
      @author: TrangLe
    */
     CreateHotAdvs(hotAdvsFormData:FormData): Observable<any> {

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            // xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpZW1uZ3V5ZW5Adm9vYy52biIsIm9yaWdfaWF0IjoxNTE5Mjk1NDM1LCJ1c2VyX2lkIjozNjAsImVtYWlsIjoiZGllbW5ndXllbkB2b29jLnZuIiwiZXhwIjoxNTE5Mjk1NzM1fQ.z7K4Q6AiT0v6l2BMjrgjBXDqbFUMKTmVxfv4ASv70ng');
            xhr.open('POST', api.hot_advs);
            xhr.send(hotAdvsFormData);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(JSON.parse(xhr.response));
                    }
                }
            }
        });
    }

    deleteHotAdvsSelected(hot_advs_id): Observable<any> {
      let url = `${api.hot_advs}`;
      let param = {
          hot_advs_id: hot_advs_id
        }
      let _options = new RequestOptions({
        headers: httpOptions.headers,
        body: JSON.stringify(param)
      });

      return this.http.delete(url,_options ).map((res: Response) => res.json()).catch(this.handleError);
    }

  	/* 
      Handle error
    */
  	handleError(error: Response) {
  		return Observable.throw(error);
  	}
}
