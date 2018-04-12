import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateValidators } from './../../shared/validators/date-validators';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { OpenTimeService } from './../../shared/services/open-time.service';
import * as moment from 'moment';
import { ValidateSubmit } from './../../shared/validators/validate-submit';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'app-open-time',
    templateUrl: './open-time.component.html',
    styleUrls: ['./open-time.component.css'],
    providers: [OpenTimeService]
})
export class OpenTimeComponent implements OnInit {

    @ViewChild(CalendarComponent) viCalendar: CalendarComponent;

    formOpenTime: FormGroup;

    list_day = [];

    events_new = [];

    errorMessage: any;

    // config options full calendar
    calendarOptions: Options;
    is_init_calendar: boolean = true;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private openTimeService: OpenTimeService,
        private toastr: ToastrService,
    ) { }

    ngOnInit() {
        this.creatForm();
        

        let date_now = new Date();
        this.getOpenTime(date_now.getMonth() + 1, date_now.getFullYear());
    }


    getOpenTime(month, year){
        this.openTimeService.getOpenTime(month, year).subscribe(
            (data) => {
                if(this.is_init_calendar){
                    this.calendarOptions = {
                        locale: 'vi',
                        editable: false,
                        eventLimit: false,
                        buttonText: {
                            today: 'Hôm nay'
                        },
                        events: data
                    };
                    this.is_init_calendar = false;
                }else{
                    let el = [
                        {
                            title: 'Meeting',
                            start: '2018-04-12T10:30:00',
                            end: '2018-04-14T12:30:00'
                        },
                        {
                            title: 'Lunch',
                            start: '2018-04-12T12:00:00'
                        }
                    ];

                    this.viCalendar.fullCalendar('removeEvents');
                    this.viCalendar.fullCalendar('addEventSource', data);
                }
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

    clickButton(event) {
        let month = event.data.month() + 1;
        let year = event.data.year();
        this.getOpenTime(month, year);
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
        }, {validator: DateValidators.dateTimeLessThan()});
    }

    /*
        function ckbDayAll(): select checkbox all dates of the week
        author: Lam
    */ 
    ckbDayAll(event){
        this.list_day = [];
        // target checked is true let checked all checkbox, is false let unchecked
        if(event.target.checked){
            this.list_day = [1,2,3,4,5,6,7];
            $('.table-open-time tbody input').prop('checked', true);
        }else{
            $('.table-open-time tbody input').prop('checked', false);
        }
    }

    /*
        function ckbDay(): select checkbox dates of the week
        author: Lam
    */ 
    ckbDay(event){
        // get value input 
        let number_day = parseInt(event.target.value);
        // target checked is true let push number day to list_day
        if(event.target.checked){
            this.list_day.push(number_day);
            // check length list_day = 7(7 day in week) let input checkbox all will checked
            if(this.list_day.length === 7){
                $('#checked_all').prop('checked', true);
            }
        }else{ 
            $('#checked_all').prop('checked', false);
            // Remove number day in array list_day
            this.list_day = this.list_day.filter(k => k !== number_day);
        }
    }

    onSubmit(){
        if(this.formOpenTime.invalid){
            ValidateSubmit.validateAllFormFields(this.formOpenTime);
        }else{
            this.formOpenTime.value.day_of_week = this.list_day;
            this.formOpenTime.value.start_date = this.formOpenTime.value.start_date.format("DD/MM/YYYY");
            this.formOpenTime.value.end_date = this.formOpenTime.value.end_date.format("DD/MM/YYYY");
            this.formOpenTime.value.start_time = this.formOpenTime.value.start_time.format("HH:mm");
            this.formOpenTime.value.end_time = this.formOpenTime.value.end_time.format("HH:mm");
            this.openTimeService.addOpenTime(this.formOpenTime.value).subscribe(
                (data) => {
                    this.toastr.success(`Thêm mới giờ mở cửa thành công`);
                    this.formOpenTime.reset();
                    this.list_day = [];
                    $('.table-open-time tr td input:checkbox').prop('checked', false);
                    let date_now = new Date();
                    this.getOpenTime(date_now.getMonth() + 1, date_now.getFullYear());
                },
                (error) => {
                    // code 400, erro validate
                    if(error.code === 400){
                        this.errorMessage = error.message;
                    }else{
                        this.router.navigate(['/error', { message: error.message}]);
                    }
                }
            );
        }
    }

}
