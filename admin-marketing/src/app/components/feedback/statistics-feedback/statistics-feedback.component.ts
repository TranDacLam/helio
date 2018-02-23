import { Component, OnInit } from '@angular/core';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { FeedbackService } from '../../../shared/services/feedback.service'
import 'rxjs/add/observable/throw';

@Component({
    selector: 'app-statistics-feedback',
    templateUrl: './statistics-feedback.component.html',
    styleUrls: ['./statistics-feedback.component.css']
})
export class StatisticsFeedbackComponent implements OnInit {

    myOptions: INgxMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
    };

    date_status_start: any;
    date_status_end: any;
    date_rate_start: any;
    date_rate_end: any;
    fb_status: any;
    fb_rate: any;

    message_status = '';
    message_rate = '';

    constructor(private feedbackService: FeedbackService) { }

    ngOnInit() {
        this.getStatisticFeedback();
    }

    getStatisticFeedback(){
        // this.feedbackService.getStatisticFeedback().subscribe(
        //     (data) => {
        //         console.log(data.message);
        //         this.fb_status = data.message.status;
        //         this.fb_rate = data.message.rate;
        //     }
        // );
    }

    onSubmitStatus(){
        let start = this.date_status_start ? this.date_status_start.formatted : null;
        let end = this.date_status_end ? this.date_status_end.formatted : null;
        if(start == null && end == null){
            this.message_status = '';
        }else if(start == null || end == null || start <= end){
            // ...
            this.message_status = '';
        }else{
            this.message_status = '* Vui lòng nhập ngày kết thúc lớn hơn hoặc bằng ngày bắt đầu';
        }
    }

    onSubmitRate(){
        let start = this.date_rate_start ? this.date_rate_start.formatted : null;
        let end = this.date_rate_end ? this.date_rate_end.formatted : null;
        if(start == null && end == null){
            this.message_status = '';
        }else if(start == null || end == null || start <= end){
            // ...
            this.message_rate = '';
        }else{
            this.message_rate = '* Vui lòng nhập ngày kết thúc lớn hơn hoặc bằng ngày bắt đầu';
        }
    }

}
