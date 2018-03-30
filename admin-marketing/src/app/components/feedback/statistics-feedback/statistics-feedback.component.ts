import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../../shared/services/feedback.service'
import { Router } from '@angular/router';
import 'rxjs/add/observable/throw';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-statistics-feedback',
    templateUrl: './statistics-feedback.component.html',
    styleUrls: ['./statistics-feedback.component.css'],
    providers: [FeedbackService]
})
export class StatisticsFeedbackComponent implements OnInit {

    date_status_start: any;
    date_status_end: any;
    date_rate_start: any;
    date_rate_end: any;
    fb_status: any;
    fb_rate: any;
    status_sum: number;
    rate_sum: number;

    start_date: string = '';
    end_date: string = '';

    constructor(
        private feedbackService: FeedbackService, 
        private router: Router,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.getStatisticFeedback();
    }

    /* 
        function getStatisticFeedback(): get summary feedback status status and rate
        author: Lam
    */
    getStatisticFeedback(){
        this.feedbackService.getStatisticFeedback().subscribe(
            (data) => {
                this.fb_status = data.message.status;
                this.fb_rate = data.message.rate;
                this.status_sum = data.message.status_sum;
                this.rate_sum = data.message.rate_sum;
            }
        );
    }

    /* 
        function onSubmitStatus():
         + Check validate
         + get date start and end. Later, Check date start and end exist.
         + Valid success, call service function searchStatisticFeedback to get statistic feedback status
         + Fail, show messsage error
        author: Lam
    */
    onSubmitStatus(){
        let start;
        let end;
        let isCheckValid: boolean = true;

        isCheckValid = this.checkValid('status', 'startD_status', 'endD_status');
        if(isCheckValid === false) return;

        start = $('#startD_status').val() ? String($('#startD_status').val()) : '';
        end = $('#endD_status').val() ? String($('#endD_status').val()) : '';

        // Get date to set params dispatch list feedback
        this.start_date = start;
        this.end_date = end;

        this.feedbackService.searchStatisticFeedback('status', start, end).subscribe(
            (data) => {
                this.fb_status = data.message.status;
                this.status_sum = data.message.status_sum;
            },
            (error) => {
                this.router.navigate(['/error', {message: error.message}]);
            }
        );
    }

     /* 
        function onSubmitRate():
         + Check validate
         + get date start and end. Later, Check date start and end exist.
         + Valid success, call service function searchStatisticFeedback to get statistic feedback status
         + Fail, show messsage error
        author: Lam
    */
    onSubmitRate(){
        let start;
        let end;
        let isCheckValid: boolean = true;

        isCheckValid = this.checkValid('rate', 'startD_rate', 'endD_rate');
        if(isCheckValid === false) return;

        start = $('#startD_rate').val() ? String($('#startD_rate').val()) : '';
        end = $('#endD_rate').val() ? String($('#endD_rate').val()) : '';

        this.feedbackService.searchStatisticFeedback('rate', start, end).subscribe(
            (data) => {
                this.fb_rate = data.message.rate;
                this.rate_sum = data.message.rate_sum;
            },
            (error) => {
                this.router.navigate(['/error', {message: error.message}]);
            }
        );
    }

    /*
        Function checkDate(): validate start date and end date
        Author: Lam
    */
    checkDate(startD, endD) {
        let start = $('#' + startD).val() ? moment($('#' + startD).val(), "DD/MM/YYYY").toDate() : '';
        let end = $('#' + endD).val() ? moment($('#' + endD).val(), "DD/MM/YYYY").toDate() : '';
        if(start <= end || start === '' || end === ''){
            return true;
        }
        return false;
    }

    /*
        Function formatDate(): validate format start date
        Author: Lam
    */
    formatDate(date) {
        let validatePattern = /^(\d{1,2})(\/|)(\d{1,2})(\/|)(\d{4})$/;
        let getValDate = String($('#'+ date).val());
        let dateValues = getValDate.match(validatePattern);
        if(getValDate === ''){
            return true;
        }else if(dateValues === null){
            return false;
        }
        return true;
    }

    /*
        Function checkValid(): 
         + Validate checkDate and format date
         + Error return false, message error
         + Success return true
        Author: Lam
    */
    checkValid(event, startD, endD){
        let msg_formatD = '* Định dạng ngày sai. Vui lòng chọn lại ngày dd/mm/yyy';
        let msg_checkD = '* Vui lòng nhập ngày kết thúc lớn hơn hoặc bằng ngày bắt đầu';
        let msg_validD = '* Vui lòng nhập ngày bắt đầu/kết thúc hợp lệ ';

        let isCheckDate: boolean = true;
        let isFormatDate: boolean = true;
        let isvalidDate: boolean = true;

        isFormatDate = this.formatDate(startD);

        if(isFormatDate === true){
            isFormatDate = this.formatDate(endD);
        }

        isCheckDate = this.checkDate(startD, endD);
        isvalidDate = this.validDate(startD, endD)

        if(isFormatDate === false){
            this.toastr.warning(`${msg_formatD}`);
            return false;
        }else if(isvalidDate === false){
            this.toastr.warning(`${msg_validD}`);
            return false;
        }else if(isCheckDate === false){
            this.toastr.warning(`${msg_checkD}`);
            return false;
        }
        return true;
    }

    /*
        Function trimDate(): valid date
        Author: Lam
    */
    validDate(startD, endD){
        let start = $('#' + startD).val() ? String($('#' + startD).val()) : '';
        let end = $('#' + endD).val() ? String($('#' + endD).val()) : '';
        let is_start = start ? this.trimDate(start) : true;
        let is_end = end ? this.trimDate(end) : true;
        if(is_start === false || is_end === false){
            return false;
        }
        return true;
    }

    /*
        Function trimDate(): get day, month, year
        Author: Lam
    */
    trimDate(string){
        let index_first = string.indexOf("/");
        let index_last = string.lastIndexOf("/");
        let d = parseInt(string.substring(0, index_first));
        let m = parseInt(string.substring(index_first+1, string.indexOf("/", index_first+1)));
        let y = parseInt(string.substring(index_last+1));
        return this.isValid(d,m,y);
    }

    /*
        Function daysInMonth(): get day in month
        Author: Lam
    */
    daysInMonth(m, y) {
        switch (m) {
            case 2 :
                return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
            case 9 : case 4 : case 6 : case 11 :
                return 30;
            default :
                return 31
        }
    }

    /*
        Function isValid(): check valid
        Author: Lam
    */
    isValid(d, m, y) {
        return m >= 1 && m <= 12 && d > 0 && d <= this.daysInMonth(m, y);
    }


}
