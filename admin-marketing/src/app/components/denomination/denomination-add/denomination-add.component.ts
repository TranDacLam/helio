import { Component, OnInit } from '@angular/core';

import { Denomination } from '../../../shared/class/denomination';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';

import { DenominationService } from '../../../shared/services/denomination.service';
import { Router } from "@angular/router";
import { DenominationValidators } from './../../../shared/validators/denomination-validators';

@Component({
    selector: 'app-denomination-add',
    templateUrl: './denomination-add.component.html',
    styleUrls: ['./denomination-add.component.css']
})
export class DenominationAddComponent implements OnInit {

    denominations: Denomination[] = [];
    errorMessage: string;
    
    denoForm: FormGroup;
    data:string='';
    
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private denominationService: DenominationService,
        ) { }

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.denoForm = this.fb.group({
          denomination: ['', [Validators.required, DenominationValidators.denominationValidators]],
        });
    }
    /* 
        Add Denomination
        Call service denomination
        @author: Trangle
    */
    addDenomination(denomination:any) {
        if (this.denoForm.invalid) {
            ValidateSubmit.validateAllFormFields(this.denoForm);
        } else {
            var denoArr = [];
            let denomi = this.convert_format_currency(this.data);
            denomination.denomination = denomi
            denoArr.push(denomination);

            this.denominationService.createDenomination(denomination)
            .subscribe(
                (denomination) => {
                    this.denominations.push(denomination); 
                    this.router.navigate(['/denomination-list', { message_post: this.data} ])   
                },
                (error) =>  {
                    if(error.status == 400) {
                        this.errorMessage = error.json().denomination[0];
                    } else {
                        this.router.navigate(['/error', { message: error.json().message }]);
                    }
                }
            )
        }
    }
    /* 
        Return errorMessage = '', when click input tag 
        @author: Trangle
    */
    removeMessage(er) {
       this.errorMessage = '';
    }

    format_currency(nStr) {
        // Convert number to format currency
        this.data = nStr.replace(/,/g,"").toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    convert_format_currency(number) {
        // Conver format currency from form to number. Save databse
        var denomi = number.replace(/,/g,'');
        return denomi;
    }
}
