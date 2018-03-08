import { FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';


export class DateValidators {

    static checkDate(c: FormControl): ValidationErrors {
        if(c.dirty){
            const message = {
                'fomatDate': {
                    'message': 'Ngày bắt đầu nhỏ hơn ngày kết thúc'
                }
            };
            let start = $('#start_date').val() ? moment($('#start_date').val(), "DD/MM/YYYY").toDate() : '';
            let end = $('#end_date').val() ? moment($('#end_date').val(), "DD/MM/YYYY").toDate() : '';
            if(start <= end || start === '' || end === ''){
                return null;
            }
            return message;;
        }
    }

    static formatStartDate(c: FormControl): ValidationErrors {
        if(c.dirty){
            let validatePattern = /^(\d{1,2})(\/|)(\d{1,2})(\/|)(\d{4})$/;
            let getValDate = String($('#start_date').val());
            let dateValues = getValDate.match(validatePattern);
            if(getValDate === ''){
                return {
                    'required_date': {
                        'message': 'Trường này bắt buộc'
                    }
                };
            }else if(dateValues === null){
                return {
                    'fomatDate': {
                        'message': 'Định dạng ngày không đúng'
                    }
                };
            }
            return null;
        }
    }

    static formatEndDate(c: FormControl): ValidationErrors {
        if(c.dirty){
            let validatePattern = /^(\d{1,2})(\/|)(\d{1,2})(\/|)(\d{4})$/;
            let getValDate = String($('#end_date').val());
            let dateValues = getValDate.match(validatePattern);
            if(getValDate === ''){
                return {
                    'required_date': {
                        'message': 'Trường này bắt buộc'
                    }
                };
            }else if(dateValues === null){
                return {
                    'fomatDate': {
                        'message': 'Định dạng ngày không đúng'
                    }
                };
            }
            return null;
        }
    }

    static formatStartTime(c: FormControl): ValidationErrors {
        if(c.dirty){
            let validatePattern = /^(\d{2})(:)(\d{2})$/;
            let getValTime = String($('#start_time').val());
            let timeValues = getValTime.match(validatePattern);
            if(getValTime === ''){
                return {
                    'required_time': {
                        'message': 'Trường này bắt buộc'
                    }
                };
            }else if(timeValues === null){
                return {
                    'fomatDate': {
                        'message': 'Định dạng thời gian không đúng'
                    }
                };
            }
            return null;
        }
    }

    static formatEndTime(c: FormControl): ValidationErrors {
        if(c.dirty){
            let validatePattern = /^(\d{2})(:)(\d{2})$/;
            let getValTime = String($('#end_time').val());
            let timeValues = getValTime.match(validatePattern);
            if(getValTime === ''){
                return {
                    'required_time': {
                        'message': 'Trường này bắt buộc'
                    }
                };
            }else if(timeValues === null){
                return {
                    'fomatDate': {
                        'message': 'Định dạng thời gian không đúng'
                    }
                };
            }
            return null;
        }
    }
}