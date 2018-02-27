import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../../shared/services/feedback.service'
import 'rxjs/add/observable/throw';

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

    message_status = '';
    message_rate = '';

    constructor(private feedbackService: FeedbackService) { }

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
         + Check date start and end.
         + Valid success, call service function searchStatisticFeedback to get statistic feedback status
         + Fail, show messsage error
        author: Lam
    */
    onSubmitStatus(){
        let start = this.date_status_start ? this.date_status_start : null;
        let end = this.date_status_end ? this.date_status_end : null;
        if(start == null && end == null){
            this.message_status = '* Vui lòng chọn ngày.';
        }else if(start == null || end == null || start <= end){
            let custom_start = start ? this.formatDate(start): null;
            let custom_end = end ? this.formatDate(end): null;
            this.feedbackService.searchStatisticFeedback('status', custom_start, custom_end).subscribe(
                (data) => {
                    this.fb_status = data.message.status;
                    this.fb_rate = data.message.rate;
                }
            );
            this.message_status = '';
        }else{
            this.message_status = '* Vui lòng nhập ngày kết thúc lớn hơn hoặc bằng ngày bắt đầu';
        }
    }

    /* 
        function onSubmitStatus():
         + Check date start and end.
         + Valid success, call service function searchStatisticFeedback to get statistic feedback rate 
         + Fail, show messsage error
        author: Lam
    */
    onSubmitRate(){
        let start = this.date_rate_start ? this.date_rate_start : null;
        let end = this.date_rate_end ? this.date_rate_end : null;
        if(start == null && end == null){
            this.message_rate = '* Vui lòng chọn ngày.';
        }else if(start == null || end == null || start <= end){
            let custom_start = start ? this.formatDate(start): null;
            let custom_end = end ? this.formatDate(end): null;
            this.feedbackService.searchStatisticFeedback('rate', custom_start, custom_end).subscribe(
                (data) => {
                    this.status_sum = data.message.status_sum;
                    this.rate_sum = data.message.rate_sum;
                }
            );
            this.message_rate = '';
        }else{
            this.message_rate = '* Vui lòng nhập ngày kết thúc lớn hơn hoặc bằng ngày bắt đầu';
        }
    }

    /* 
        function formatDate(): format date 
        author: Lam
    */
    formatDate(date){
        return date.getDate()+ '/'+ (date.getMonth()+1) + '/'+ date.getFullYear(); 
    }

}
