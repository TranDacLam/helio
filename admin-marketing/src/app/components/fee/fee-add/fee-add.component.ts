import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeeService } from '../../../shared/services/fee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fee-add',
  templateUrl: './fee-add.component.html',
  styleUrls: ['./fee-add.component.css']
})
export class FeeAddComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private feeService: FeeService, private router: Router) { }

  feeAddForm: FormGroup;
  messageResult: String;

  createFee(value: any){
  	this.feeService.createFee(value).subscribe(
  		result => {
   			this.messageResult = "success"; 
        this.router.navigate(['/fee']);
   		},
		error => {
			this.messageResult = error.statusText;
		});
  	}


  ngOnInit() {
  	this.feeAddForm = this.formBuilder.group({
      fee: ['', Validators.required],
      position: ['', Validators.required],
      fee_type: [ 'vnd', Validators.required],
      is_apply: [false ],
    });
  }

}
