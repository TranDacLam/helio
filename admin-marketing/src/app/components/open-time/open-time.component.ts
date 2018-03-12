import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateValidators } from './../../shared/validators/date-validators';
import * as moment from 'moment';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'app-open-time',
    templateUrl: './open-time.component.html',
    styleUrls: ['./open-time.component.css']
})
export class OpenTimeComponent implements OnInit {

    formOpenTime: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.creatForm();
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formOpenTime = this.fb.group({
            start_date: ['', 
                [DateValidators.checkDate, DateValidators.formatStartDate, DateValidators.requiredStartDate]],
            end_date: ['', 
                [DateValidators.checkDate, DateValidators.formatEndDate, DateValidators.requiredStartDate]],
            start_time: ['', 
                [DateValidators.formatStartTime]],
            end_time: ['',
                [DateValidators.formatEndTime]],
            is_draft: [false],
        });
    }

}
