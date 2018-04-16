import { Component, OnInit } from '@angular/core';

import { Denomination } from '../../../shared/class/denomination';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ToastrService } from 'ngx-toastr';

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

    denoForm: FormGroup; // denoForm is type of FormGroup
    data: string = '';

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private denominationService: DenominationService,
        private toastr: ToastrService,
    ) { }

    ngOnInit() {
        this.createForm();
    }

    /*
        Create form to add new denomination
        @author: Trangle
     */
    createForm() {
        this.denoForm = this.fb.group({
            // The FormControl call denomination
            denomination: ['', [Validators.required, Validators.maxLength(13), DenominationValidators.denominationValidators]],
        });
    }
    /* 
        Add Denomination
        Step1: Check denoForm invalid true => Show error message
        Step2: Call service denomination when denoForm valid
            + Convert denomi to inter before send server
            + call createDenomination form denomination.service
            + Success: Push data, show success message and nagivate denomination_list
            + False: Show error message
        @author: Trangle
    */
    addDenomination(denomination: any) {
        if (this.denoForm.invalid) {
            ValidateSubmit.validateAllFormFields(this.denoForm);
        } else {
            let denomi = this.convert_format_currency(this.data);
            denomination.denomination = denomi

            this.denominationService.createDenomination(denomination)
                .subscribe(
                    (denomination) => {
                        this.denominations.push(denomination);
                        this.toastr.success(`Thêm ${this.data} thành công`);
                        this.router.navigate(['/denomination-list'])
                    },
                    (error) => {
                        if (error.status == 400) {
                            // Show message on form
                            this.errorMessage = error.json();
                        } else {
                            // nagivate to component error and show message
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

    /*
        format denomination
        @author: Trangle
     */
    format_currency(nStr) {
        // Convert number to format currency
        this.data = nStr.replace(/,/g, "").toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }

    /*
        Convert format denominatio before send server
        @author: Trangle
     */
    convert_format_currency(number) {
        // Conver format currency from form to number. Save databse
        var denomi = number.replace(/,/g, '');
        return denomi;
    }
}
