import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Location } from '@angular/common';
import { Event } from '../../../shared/class/event';
import { EventService } from '../../../shared/services/event.service';
import { env } from '../../../../environments/environment';
import { DateValidators } from './../../../shared/validators/date-validators';
import * as moment from 'moment';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'form-event',
    templateUrl: './form-event.component.html',
    styleUrls: ['./form-event.component.css'],
    providers: [EventService]
})
export class FormEventComponent implements OnInit {

    /*
        author: Lam
    */

    @Input() event: Event; // Get event from component parent
    @Input() type_http; // Get type http from component parent

    formEvent: FormGroup;

    errorMessage: any; // Messages error
    msg_clear_image = '';

    api_domain: string = '';

    constructor(
        private eventService: EventService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
        this.creatForm();
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formEvent = this.fb.group({
            name: [this.event.name, Validators.required],
            image: [this.event.image],
            short_description: [this.event.short_description, Validators.required],
            content: [this.event.content, Validators.required],
            start_date: [this.event.start_date ? moment(this.event.start_date,"DD/MM/YYYY").toDate() : '', 
                [DateValidators.checkDate, DateValidators.formatStartDate, DateValidators.requiredStartDate]],
            end_date: [this.event.end_date ? moment(this.event.end_date,"DD/MM/YYYY").toDate() : '', 
                [DateValidators.checkDate, DateValidators.formatEndDate, DateValidators.requiredStartDate]],
            start_time: [this.event.start_time ? moment(this.event.start_time,"HH:mm").format() : '', 
                [DateValidators.formatStartTime]],
            end_time: [this.event.end_time ? moment(this.event.end_time,"HH:mm").format() : '',
                [DateValidators.formatEndTime]],
            is_draft: [this.event.is_draft],
            is_clear_image: [false]
        });
    }

    /*
        Function onFileChange(): Input file image to get base 64
        author: Lam
    */ 
    onFileChange(event): void{
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formEvent.get('image').setValue({
                filename: file.name,
                filetype: file.type,
                value: file,
            });
        }
    }

    /*
        Function onSubmit():
         + Step 1: Check type_http add event (post), edit event (put)
         + Step 2:  
            * TH1:  + Type_http = post, call service function addEvent() to add event, 
                    + Later, redirect list event with message
            * TH2:  + Type_http = put call service function updateEvent() to update Event
                    + Later, redirect list event with message
        author: Lam
    */ 
    onSubmit(): void{
        this.formEvent.value.start_date = $('#start_date').val();
        this.formEvent.value.end_date = $('#end_date').val();
        this.formEvent.value.start_time = $('#start_time').val();
        this.formEvent.value.end_time = $('#end_time').val();
        let event_form_data = this.convertFormGroupToFormData(this.formEvent);
        let value_form = this.formEvent.value;
        if(this.type_http == 'post'){
            this.eventService.addEvent(event_form_data).subscribe(
                (data) => {
                    this.router.navigate(['/event/list', { message_post: value_form.name}]);
                },
                (error) => {
                    if(error.code === 400){
                        this.errorMessage = error.message;
                    }else{
                        this.router.navigate(['/error', { message: error.message}]);
                    }
                }
            );
        }else if(this.type_http == 'put'){
            if(value_form.is_clear_image === true && typeof(value_form.image) != 'string'){
                this.formEvent.get('is_clear_image').setValue(false);
                this.msg_clear_image = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
            }else{
                this.eventService.updateEvent(event_form_data, this.event.id).subscribe(
                    (data) => {
                        this.router.navigate(['/event/list', { message_put: value_form.name}]);
                    },
                    (error) => {
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

    /*
        Function deleteNotificationEvent(): confirm delete
        @author: Lam
    */
    deleteEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn",
            message: "Bạn muốn xóa sự kiện này?",
            buttons: {
                cancel: {
                    label: "Hủy"
                },
                confirm: {
                    label: "Xóa"
                }
            },
            callback: function (result) {
                if(result) {
                    that.onDelete();
                }
            }
        });
    }

    /*
        Function onDelete():
         + Get id from url path
         + Call service function onDelEvent() by id to delete event
        Author: Lam
    */
    onDelete(): void {
        const id = this.event.id;
        this.eventService.onDelEvent(id).subscribe();
        this.router.navigate(['/event/list']);
    }

    /*
        Convert form group to form data to submit form
        @author: lam
    */
    private convertFormGroupToFormData(promotionForm: FormGroup) {
        // Convert FormGroup to FormData
        let promotionValues = promotionForm.value;
        let promotionFormData:FormData = new FormData(); 
        if (promotionValues){
            /* 
                Loop to set value to formData
                Case1: if value is null then set ""
                Case2: If key is image field then set value have both file and name
                Else: Set value default
            */
            Object.keys(promotionValues).forEach(k => { 
                if(promotionValues[k] == null) {
                    promotionFormData.append(k, '');
                } else if (k === 'image') {
                    promotionFormData.append(k, promotionValues[k].value, promotionValues[k].name);
                } else {
                    promotionFormData.append(k, promotionValues[k]);
                }
            });
        }
        return promotionFormData;
    }

}
