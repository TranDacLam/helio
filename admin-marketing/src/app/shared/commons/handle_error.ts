import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HandleError {

	constructor(private router: Router, private toastr: ToastrService,){

    }
	handle_error(error){
		if (error.status == 403 || error.code == 403 ){
			if (error.message){
				return this.toastr.warning(`${error.message}`);
			}
			return this.toastr.warning(`Bạn không có quyền.`);
		}
		if (error.status == 401 || error.code == 401 ){
			return this.router.navigate(['/login']);
		}
		if (error.status == 400 || error.code == 400 ){
            return this.router.navigate(['/error', { message: error.message}]);
        }
        return this.router.navigate(['/error', { message: error.message}]);
        
	};
}