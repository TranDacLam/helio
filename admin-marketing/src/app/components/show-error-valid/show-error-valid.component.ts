import { Component, OnInit, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';

@Component({
    selector: 'show-error-valid',
    templateUrl: './show-error-valid.component.html',
    styleUrls: ['./show-error-valid.component.css']
})
export class ShowErrorValidComponent implements OnInit {

    private static readonly errorMessages = {
       'required': () => 'This field is required',
       'email': () => 'Email is valid format',
       'minlength': (params) => 'The min number of characters is ' + params.requiredLength,
       'maxlength': (params) => 'The max allowed number of characters is ' + params.requiredLength,
       'pattern': (params) => 'The required pattern is: ' + params.requiredPattern,
       'years': (params) => params.message,
       'countryCity': (params) => params.message,
       'uniqueName': (params) => params.message,
       'telephoneNumbers': (params) => params.message,
       'telephoneNumber': (params) => params.message
    };

    @Input()
    private control: AbstractControlDirective | AbstractControl;

    constructor() { }

    ngOnInit() {
    }

    shouldShowErrors(): boolean {
        return this.control && this.control.errors &&
            (this.control.dirty || this.control.touched);
    }

    listOfErrors(): string[] {
        return Object.keys(this.control.errors)
            .map(field => this.getMessage(field, this.control.errors[field]));
    }

    private getMessage(type: string, params: any) {
        return ShowErrorValidComponent.errorMessages[type](params);
    }

}
