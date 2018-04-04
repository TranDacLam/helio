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

    list_day = [];
    select_all: boolean = false;

    calendarOptions:Object = {
        defaultDate: '2018-03-12',
        locale: 'vi',
        eventLimit: true, // allow "more" link when too many events
        events: [
            {
              title: 'All Day Event',
              start: '2018-03-01'
            },
            {
              title: 'Long Event',
              start: '2018-03-07',
              end: '2018-03-10'
            },
            {
              id: 999,
              title: 'Repeating Event',
              start: '2018-03-09T16:00:00'
            },
            {
              id: 999,
              title: 'Repeating Event',
              start: '2018-03-16T16:00:00'
            },
            {
              title: 'Conference',
              start: '2018-03-11',
              end: '2018-03-13'
            },
            {
              title: 'Meeting',
              start: '2018-03-12T10:30:00',
              end: '2018-03-12T12:30:00'
            },
            {
              title: 'Lunch',
              start: '2018-03-12T12:00:00'
            },
            {
              title: 'Meeting',
              start: '2018-03-12T14:30:00'
            },
            {
              title: 'Happy Hour',
              start: '2018-03-12T17:30:00'
            },
            {
              title: 'Dinner',
              start: '2018-03-12T20:00:00'
            },
            {
              title: 'Birthday Party',
              start: '2018-03-13T07:00:00'
            },
            {
              title: 'Click for Google',
              url: 'http://google.com/',
              start: '2018-03-28'
            }
        ]
    };

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
                [DateValidators.validStartDate, DateValidators.formatStartDate, DateValidators.requiredStartDate]],
            end_date: ['', 
                [DateValidators.validEndDate, DateValidators.formatEndDate, DateValidators.requiredEndDate]],
            start_time: ['', 
                [DateValidators.validStartTime, DateValidators.requiredStartTime, DateValidators.formatStartTime]],
            end_time: ['',
                [DateValidators.validEndTime, DateValidators.requiredEndTime, DateValidators.formatEndTime]],
            is_draft: [false],
        }, {validator: [DateValidators.dateLessThan(), DateValidators.timeLessThan()]});
    }

    ckbDayAll(event){
        this.list_day = [];
        if(event.target.checked){
            this.list_day = [1,2,3,4,5,6,7];
            $('.table-open-time tbody input').prop('checked', true);
        }else{
            $('.table-open-time tbody input').prop('checked', false);
        }
    }

    ckbDay(event){
        let number_day = parseInt(event.target.value);
        if(event.target.checked){
            this.list_day.push(number_day);
            if(this.list_day.length === 7){
                this.select_all = true;
            }
        }else{
            this.select_all = false;
            this.list_day = this.list_day.filter(k => k !== number_day);
        }
    }

    onSubmit(){
        
    }

}
