import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Event } from '../../../shared/class/event';
import { EventService } from '../../../shared/services/event.service';
import 'rxjs/add/observable/throw';


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

    // set inputImage property as a local variable, #inputImage on the tag input file
    @ViewChild('inputImage')
    inputImage: any;

    @Input() event: Event; // Get notification from component parent
    @Input() type_http; // Get type http from component parent
    
    // Return 1 object to parent
    @Output() update_noti: EventEmitter<Event> = new EventEmitter<Event>();

    formEvent: FormGroup;

    errorMessage = ''; // Messages error

    constructor(
        private eventService: EventService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.creatForm();
    }

    onCkeditor(event){
        console.log(event)
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formEvent = this.fb.group({
            name: [this.event.name, Validators.required],
            image: [this.event.image, Validators.required],
            short_description: [this.event.short_description, Validators.required],
            content: [this.event.content, Validators.required],
            start_date: [this.event.start_date, Validators.required],
            end_date: [this.event.end_date, Validators.required],
            start_time: [this.event.start_time, Validators.required],
            end_time: [this.event.end_time, Validators.required],
            is_draft: [this.event.is_draft],
        });
    }

    /*
        Function onFileChange(): Input file image to get base 64
        author: Lam
    */ 
    onFileChange(event): void{
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.formEvent.get('image').setValue(reader.result.split(',')[1]);
            };
        }
    }

    /*
        Function clearFile(): Clear value input file image
        author: Lam
    */ 
    clearFile(): void {
        this.formEvent.get('image').setValue(null);
        this.inputImage.nativeElement.value = "";
    }

    /*
        Function onSubmit():
         + Step 1: Check type_http add notification (post), edit notification (put), edit use modal (put_popup)
         + Step 2:  
            * TH1:  + Type_http = post, callback service function addNoti() to add Notification, 
                    + Later, redirect list notification with message
            * TH2:  + Type_http = put or put_popup, callback service function updateNoti() to update Notification
                    + Type_http = put then redirect list notification with message
                    + Type_http = put_popup then update Notification show and hidden modal  
        author: Lam
    */ 
    onSubmit(): void{
        if(this.type_http == 'post'){
            this.eventService.addEvent(this.formEvent.value).subscribe(
                (data) => {
                    this.router.navigate(['/event/list', { message_post: this.formEvent.value.name}]);
                },
                (error) => {
                    { this.errorMessage = error.message; } 
                }
            );
        }else if(this.type_http == 'put'){
            this.eventService.updateEvent(this.formEvent.value, this.event.id).subscribe(
                (data) => {
                    this.event = data;
                    this.router.navigate(['/event/list', { message_put: this.formEvent.value.name}]);
                },
                (error) => {
                    { this.errorMessage = error.message; } 
                }
            );
        }
        
    }

    /*
        Function onDelete():
         + Get id from url path
         + Callback service function onDelNoti() by id to delete notification
        Author: Lam
    */
    onDelete(): void {
        const id = this.event.id;
        this.eventService.onDelNoti(id).subscribe();
        this.router.navigate(['/notifications']);
    }

}
