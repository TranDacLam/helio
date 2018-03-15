import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/catch";

import { User } from '../class/user';
import { Promotion } from '../class/promotion';
import { api } from '../utils/api';


/*
    @author: diemnguyen
*/
@Injectable()
export class PromotionService {

    httpOptions: any;
    token: any = '';

    constructor(private http: Http) { 
        this.token = localStorage.getItem('auth_token');

        this.httpOptions = {
            headers: new Headers({ 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            })
        };
    }

    /*  
        Get user promotion list
        @author: diemnguyen
    */
    getUsersPromotion(id: number): Observable<any> {
        let user_promotion_url = `${api.user_promotion}${id}/`
        return this.http.get(user_promotion_url, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);

    }

    /*  
        Get all promotion
        @author: diemnguyen
    */
    getAllPromotion(): Observable<any> {
        return this.http.get(api.promotion_list, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /*  
        Get promotion by Id
        @author: diemnguyen
    */
    getPromotionById(id: number): Observable<any> {
        let promotion_detail_url = `${api.promotion}${id}/`;
        return this.http.get(promotion_detail_url, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }


    /*  
        Delete promotion by Id
        @author: diemnguyen
    */
    deletePromotionById(id: number): Observable<any> {
        let promotion_detail_url = `${api.promotion}${id}/`;
        return this.http.delete(promotion_detail_url, this.httpOptions).map((res: Response) => res.json()).catch(this.handleError);
    }

    /*  
        Save Promotion
        @author: diemnguyen
    */
    savePromotion(promotionFormData:FormData): Observable<any> {

        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            
            xhr.open('POST', api.promotion);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(promotionFormData);

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
        Update promotion by Id
        @author: diemnguyen
    */
  
     updatePromotion(promotionFormData:FormData, id: number): Observable<any> { 
        let promotion_detail_url = `${api.promotion}${id}/`;
        return Observable.create(observer => {
            let xhr = new XMLHttpRequest();
            // xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRpZW1uZ3V5ZW5Adm9vYy52biIsIm9yaWdfaWF0IjoxNTE5Mjk1NDM1LCJ1c2VyX2lkIjozNjAsImVtYWlsIjoiZGllbW5ndXllbkB2b29jLnZuIiwiZXhwIjoxNTE5Mjk1NzM1fQ.z7K4Q6AiT0v6l2BMjrgjBXDqbFUMKTmVxfv4ASv70ng');
            xhr.open('PUT', promotion_detail_url);
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(promotionFormData);

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
        Delete list promotion selected
        @author: diemnguyen
    */
    deletePromotionList(list_id_selected): Observable<any>{
        let param = {
            list_promotion_id: list_id_selected
        }

        let _options_delete = new RequestOptions({
            headers: this.httpOptions.headers,
            body: JSON.stringify(param)
        });
        return this.http.delete(api.promotion_list, _options_delete).catch(this.handleError);
    }

    /*  
        Update User Promotion
        @author: diemnguyen
    */
    updateUserPromotion(id: number, list_user_id): Observable<any>{
        let user_promotion_url = `${api.user_promotion}${id}/`
        let param = {
            list_user_id: list_user_id
        }
        return this.http.post(user_promotion_url, JSON.stringify(param), this.httpOptions).catch(this.handleError);
    }
    /*  
        Generator QR code
        @author: diemnguyen
    */
    generator_QR_code(id: number): Observable<any>{
        let generator_QR_code_url = `${api.generator_QR_code}${id}/`
        return this.http.post(generator_QR_code_url, JSON.stringify({'vo':'promotion'}), this.httpOptions).catch(this.handleError);
    }

    private handleError(error: Response) {
        return Observable.throw(error.statusText);
    }



}
