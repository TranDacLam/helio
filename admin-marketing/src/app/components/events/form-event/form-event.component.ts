import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Location } from '@angular/common';
import { Event } from '../../../shared/class/event';
import { EventService } from '../../../shared/services/event.service';
import { env } from '../../../../environments/environment';
import { DateValidators } from './../../../shared/validators/date-validators';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ImageValidators } from './../../../shared/validators/image-validators';
import * as moment from 'moment';
import * as ckeditor_config from './../../../shared/commons/ckeditor_config';
import { ToastrService } from 'ngx-toastr';
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
    event: Event;
    formEvent: FormGroup;

    errorMessage: any; // Messages error
    msg_clear_image = '';

    api_domain: string = '';
    lang = 'vi';
    title_page = '';

    ckEditorConfig:any;

    constructor(
        private eventService: EventService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) {
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
        // get params url
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });

        this.ckEditorConfig = ckeditor_config.config;

        if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title_page = "Chỉnh Sửa Sự Kiện";
            this.getEvent();
        } else {
            // Add new Form
            this.title_page = "Thêm Sự Kiện";
            this.event = new Event();
            this.creatForm();
        }
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formEvent = this.fb.group({
            name: [this.event.name, [Validators.required, Validators.maxLength(255)]],
            image: [this.event.image, [ImageValidators.validateFile]],
            short_description: [this.event.short_description, [Validators.required, Validators.maxLength(350)]],
            content: [this.event.content, Validators.required],
            start_date: [this.event.start_date ? moment(this.event.start_date,"DD/MM/YYYY").toDate() : '', 
                [DateValidators.validStartDate, DateValidators.formatStartDate, DateValidators.requiredStartDate]],
            end_date: [this.event.end_date ? moment(this.event.end_date,"DD/MM/YYYY").toDate() : '', 
                [DateValidators.validEndDate, DateValidators.formatEndDate, DateValidators.requiredStartDate]],
            start_time: [this.event.start_time ? moment(this.event.start_time,"HH:mm").format() : '', 
                [DateValidators.validStartTime, DateValidators.formatStartTime]],
            end_time: [this.event.end_time ? moment(this.event.end_time,"HH:mm").format() : '',
                [DateValidators.validEndTime, DateValidators.formatEndTime]],
            is_draft: [this.event.is_draft === true ? true : false],
            is_clear_image: [false]
        }, {validator: [this.dateLessThan(), this.timeLessThan()]});
    }

    /*
        Function dateLessThan(): validate start date and end date
        Author: Lam
    */
    dateLessThan() {
        return (group: FormGroup): {[key: string]: any} => {
            let start = $('#start_date').val() ? moment($('#start_date').val(), "DD/MM/YYYY").toDate() : '';
            let end = $('#end_date').val() ? moment($('#end_date').val(), "DD/MM/YYYY").toDate() : '';
            if(start <= end || start === '' || end === ''){
                return {};
            }
            return {
                dates: "Vui lòng nhập ngày kết thúc lớn hơn hoặc bằng ngày bắt đầu"
            };
        }
    }

    /*
        Function timeLessThan(): validate start time and end time
        Author: Lam
    */
    timeLessThan(){
        return (group: FormGroup): {[key: string]: any} => {
            let start_date = $('#start_date').val() ? $('#start_date').val() : '';
            let end_date = $('#end_date').val() ? $('#end_date').val() : '';
            let start_time = $('#start_time').val() ? moment($('#start_time').val(), 'HH:mm').toDate() : '';
            let end_time = $('#end_time').val() ? moment($('#end_time').val(), 'HH:mm').toDate() : '';
            if(start_date === end_date && start_time >= end_time){
                return {
                    times: "Vui lòng nhập thời gian kết thúc lớn hơn thời gian bắt đầu"
                };
            }
            return {};
        }
    }    

    /*
        Function getEvent():
         + Get id from url path
         + Callback service function getEvent() by id
        Author: Lam
    */
    getEvent(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.eventService.getEvent(id, this.lang).subscribe(
            (data) => {
                this.event = data;
                this.creatForm();
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
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
         + Step 1: Check event add event (post), edit event (put)
         + Step 2:  
            * TH1:  + event id empty, call service function addEvent() to add event, 
                    + Later, redirect list event with message
            * TH2:  + event id exist call service function updateEvent() to update Event
                    + Later, redirect list event with message
        author: Lam
    */ 
    onSubmit(): void{
        // set and update valdiator, so error validate ng-datetime "owlDateTimeParse"
        this.formEvent.controls['start_date'].setValidators([DateValidators.validStartDate,
            DateValidators.formatStartDate, DateValidators.requiredStartDate]);
        this.formEvent.controls['start_date'].updateValueAndValidity();
        this.formEvent.controls['end_date'].setValidators([DateValidators.validEndDate,
            DateValidators.formatEndDate, DateValidators.requiredStartDate]);
        this.formEvent.controls['end_date'].updateValueAndValidity();
        this.formEvent.controls['start_time'].setValidators([DateValidators.validStartTime,
            DateValidators.formatStartTime]);
        this.formEvent.controls['start_time'].updateValueAndValidity();
        this.formEvent.controls['end_time'].setValidators([DateValidators.validEndTime,
            DateValidators.formatEndTime]);
        this.formEvent.controls['end_time'].updateValueAndValidity();
        
        if(this.formEvent.invalid){
            ValidateSubmit.validateAllFormFields(this.formEvent);
            $('html,body').animate({ scrollTop: $('.ng-invalid').offset().top }, 'slow');
        }else{
            this.formEvent.value.start_date = $('#start_date').val();
            this.formEvent.value.end_date = $('#end_date').val();
            this.formEvent.value.start_time = $('#start_time').val();
            this.formEvent.value.end_time = $('#end_time').val();
            let event_form_data = this.convertFormGroupToFormData(this.formEvent);
            let value_form = this.formEvent.value;
            if(!this.event.id){
                this.eventService.addEvent(event_form_data, this.lang).subscribe(
                    (data) => {
                        this.toastr.success(`Thêm mới "${value_form.name}" thành công`);
                        this.router.navigate(['/event/list']);
                    },
                    (error) => {
                        if(error.code === 400){
                            this.errorMessage = error.message;
                            $('html,body').animate({ scrollTop: $('.title').offset().top }, 'slow');
                        }else{
                            this.router.navigate(['/error', { message: error.message}]);
                        }
                    }
                );
            }else if(this.event.id){
                if(value_form.is_clear_image === true && typeof(value_form.image) != 'string'){
                    this.formEvent.get('is_clear_image').setValue(false);
                    this.msg_clear_image = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
                }else{
                    this.eventService.updateEvent(event_form_data, this.event.id, this.lang).subscribe(
                        (data) => {
                            this.toastr.success(`Chỉnh sửa "${value_form.name}" thành công`);
                            this.router.navigate(['/event/list']);
                        },
                        (error) => {
                            if(error.code === 400){
                                this.errorMessage = error.message;
                                $('html,body').animate({ scrollTop: $('.title').offset().top }, 'slow');
                            }else{
                                this.router.navigate(['/error', { message: error.message}]);
                            }
                        }
                    );
                }
            }
        }
    }

    /*
        Function deleteEvent(): confirm delete
        @author: Lam
    */
    deleteEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Sự Kiện này?",
            buttons: {
                cancel: {
                    label: "HỦY"
                },
                confirm: {
                    label: "XÓA"
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
        this.eventService.onDelEvent(id, this.lang).subscribe(
            (data) => {
                this.toastr.success(`Xóa "${this.formEvent.value.name}" thành công`);
                this.router.navigate(['/event/list']);
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
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
