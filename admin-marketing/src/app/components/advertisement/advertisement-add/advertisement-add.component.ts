import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ToastrService } from 'ngx-toastr'

import { Advertisement } from '../../../shared/class/advertisement';
import { AdvertisementService } from '../../../shared/services/advertisement.service';

import { Router } from "@angular/router";

@Component({
  selector: 'app-advertisement-add',
  templateUrl: './advertisement-add.component.html',
  styleUrls: ['./advertisement-add.component.css']
})
export class AdvertisementAddComponent implements OnInit {

   	constructor(
   		private advertisementService: AdvertisementService,
        private router: Router,
        private fb: FormBuilder,
        private toastr: ToastrService,
   	){ }

   	advs: Advertisement[] = [];
   	errorMessage: string = "";
   	is_show = false;
    advForm: FormGroup;
    lang: string = 'vi';

   	ngOnInit() {
       this.createForm();
   	}

    createForm() {
        this.advForm = this.fb.group({
          name: ['', [Validators.required, Validators.maxLength(255)]],
          is_show: [false]
        });
    }
    /*
        POST: Create New Advertiment
        @author: TrangLe
     */
   	CreateAdv() {
        if( this.advForm.invalid) {
            ValidateSubmit.validateAllFormFields(this.advForm);
        } else {
       		this.advertisementService.addAdvertisement( this.advForm.value, this.lang ).subscribe(
    			(resultAdv) => {
    				this.advs.push(resultAdv);
                    this.toastr.success(`Thêm ${this.advForm.value['name']} thành công`);
                    this.router.navigate(['/advertisement-list'])
    			},
                (error) => {
                    if (error.status == 400 ) {
                        this.errorMessage = error.json()
                    } else {
                        this.router.navigate(['/error', { message: error.json().message }])
                    }
                }
            );
        }
    }
    removeMessage() {
        this.errorMessage = '';
    }
}
