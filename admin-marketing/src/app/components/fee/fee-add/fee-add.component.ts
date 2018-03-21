import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeeService } from '../../../shared/services/fee.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  submitted: boolean= false;
  createFee(value: any, isValid: boolean){
    this.submitted = true;
    if (isValid){
      this.feeService.createFee(value).subscribe(
      result => {
          this.messageResult = "success"; 
          this.router.navigate(['/fee/list']);
          this.toastr.success(`Thêm mới "${this.feeAddForm.value.fee} ${this.feeAddForm.value.fee_type}" thành công`);
         },
      error => {
          this.router.navigate(['/error']);
      });
    }
  	
  	}


  ngOnInit() {
  	this.feeAddForm = this.formBuilder.group({
      fee: [null, [Validators.required, Validators.pattern('[0-9]+'), Validators.min(0), Validators.max(2147483647)]],
      position: [null, Validators.required],
      fee_type: [ 'vnd', Validators.required],
      is_apply: [false ],
    });
  }

}
