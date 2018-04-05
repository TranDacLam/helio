import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeeService } from '../../../shared/services/fee.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NumberValidators } from './../../../shared/validators/number-validators';
import { ValidateSubmit } from './../../../shared/validators/validate-submit'

@Component({
    selector: 'app-fee-add',
    templateUrl: './fee-add.component.html',
    styleUrls: ['./fee-add.component.css']
})
export class FeeAddComponent implements OnInit {

    constructor(
        private formBuilder: FormBuilder,
        private feeService: FeeService,
        private router: Router,
        private toastr: ToastrService) {

    }

    feeAddForm: FormGroup;
    messageResult: String;
    errorMessage: String;

    createFee(value: any) {
        if (this.feeAddForm.invalid) {
            ValidateSubmit.validateAllFormFields(this.feeAddForm);
        } else {
            this.feeService.createFee(value).subscribe(
            result => {
                this.messageResult = "success";
                this.router.navigate(['/fee/list']);
                this.toastr.success(`Thêm mới "${this.feeAddForm.value.fee} ${this.feeAddForm.value.fee_type}" thành công`);
            },
            (error) => {
                if (error.code === 400) {
                    this.errorMessage = error.message;
                } else {
                    this.router.navigate(['/error', { message: error.message }]);
                }
            }
        );
        }
    }


    ngOnInit() {
        this.feeAddForm = this.formBuilder.group({
            fee: [null, [Validators.required, Validators.maxLength(10), NumberValidators.validateFee]],
            position: [null, Validators.required],
            fee_type: ['vnd', Validators.required],
            is_apply: [false],
        });
    }

}
