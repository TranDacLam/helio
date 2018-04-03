import { FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';
import { CheckDateValid } from './check-date-valid';


export class DateValidators {

    constructor() {}

    /*
        Function validStartDate(): validate date of month, month of year
        Author: Lam
    */
    static validStartDate(c: FormControl): ValidationErrors{
        if(c.dirty){
            let dateValidators = new DateValidators();
            let message = 'Vui lòng nhập ngày bắt đầu hợp lệ';
            return dateValidators.validDate(message, 'start_date');
        }
    }

    /*
        Function validEndDate(): validate day of month, month of year
        Author: Lam
    */
    static validEndDate(c: FormControl): ValidationErrors{
        if(c.dirty){
            let dateValidators = new DateValidators();
            let message = 'Vui lòng nhập ngày kết thúc hợp lệ';
            return dateValidators.validDate(message, 'end_date');
        }
    }

    validDate(message_error, str_date){
        let checkDateValid = new CheckDateValid();
        const message = {
            'fomatDate': {
                'message': message_error
            }
        };
        let date = $('#'+str_date).val() ? String($('#'+str_date).val()) : '';
        let is_valid = date ? checkDateValid.trimDate(date) : true;
        if(is_valid === true){
            return null;
        }
        return message;
    }

    /*
        Function validStartTime(): check valid time
        Author: Lam
    */
    static validStartTime(c: FormControl): ValidationErrors{
        let dateValidators = new DateValidators();
        let message = 'Vui lòng nhập thời gian bắt đầu hợp lệ';
        return dateValidators.validTime(message, 'start_time');
    }

    /*
        Function validEndTime(): check valid time
        Author: Lam
    */
    static validEndTime(c: FormControl): ValidationErrors{
        let dateValidators = new DateValidators();
        let message = 'Vui lòng nhập thời gian kết thúc hợp lệ';
        return dateValidators.validTime(message, 'end_time');
    }

    validTime(message_error, str_time){
        const message = {
            'fomatDate': {
                'message': message_error
            }
        };
        let time = $('#'+str_time).val() ? String($('#'+str_time).val()) : '';
        if(time.indexOf(',') !== -1){
            time = time.substr(0,time.indexOf(','));
        }
        if(time){
            let hours = parseInt(time.substring(0, time.indexOf(":")));
            let minute = parseInt(time.substring(time.indexOf(":")+1));
            if(hours >= 24 || minute >= 60 ){
                return message;
            }
        }
        return null;
    }

    /*
        Function formatStartDate(): validate format start date
        Author: Lam
    */
    static formatStartDate(c: FormControl): ValidationErrors {
        if(c.dirty){
            let dateValidators = new DateValidators();
            return dateValidators.formatInputDate('start_date');
        }
    }

    /*
        Function formatEndDate(): validate format end date
        Author: Lam
    */
    static formatEndDate(c: FormControl): ValidationErrors {
        if(c.dirty){
            let dateValidators = new DateValidators();
            return dateValidators.formatInputDate('end_date');
        }
    }

    formatInputDate(str_date) {
        let validatePattern = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/;
        let getValDate = String($('#'+str_date).val());
        let dateValues = getValDate.match(validatePattern);
        if(getValDate === ''){
            return null;
        }else if(dateValues === null){
            return {
                'fomatDate': {
                    'message': 'Định dạng ngày sai. Vui lòng chọn lại ngày dd/mm/yyyy'
                }
            };
        }
        return null;
    }

    /*
        Function requiredStartDate(): validate required start date
        Author: Lam
    */
    static requiredStartDate(c: FormControl): ValidationErrors {
        let dateValidators = new DateValidators();
        return dateValidators.requiredDate('start_date');
    }

    /*
        Function requiredEndDate(): validate required end date
        Author: Lam
    */
    static requiredEndDate(c: FormControl): ValidationErrors {
        let dateValidators = new DateValidators();
        return dateValidators.requiredDate('end_date');
    }

    requiredDate(str_date) {
        let getValDate = String($('#'+str_date).val());
        if(getValDate === ''){
            return {
                'required_date': {
                    'message': 'Trường này không được bỏ trống'
                }
            };
        }
        return null;
    }

    /*
        Function formatStartTime(): validate format start time
        Author: Lam
    */
    static formatStartTime(c: FormControl): ValidationErrors {
        let dateValidators = new DateValidators();
        return dateValidators.formatTime('start_time');
    }

    /*
        Function formatEndTime(): validate format end time
        Author: Lam
    */
    static formatEndTime(c: FormControl): ValidationErrors {
        let dateValidators = new DateValidators();
        return dateValidators.formatTime('end_time');
    }

    formatTime(str_time) {
        let validatePattern = /^(\d{1,2})(:)(\d{2})$/;
        let getValTime = String($('#'+str_time).val());
        if(getValTime.indexOf(',') !== -1){
            getValTime = getValTime.substr(0,getValTime.indexOf(','));
        }
        let timeValues = getValTime.match(validatePattern);
        if(timeValues !== null || getValTime === ''){
            return null;
        }
        return {
            'fomatDate': {
                'message': 'Định dạng thời gian sai. Vui lòng chọn lại thời gian HH:mm'
            }
        };
        
    }

    /*
        Function requiredStartTime(): required time
        Author: Lam
    */
    static requiredStartTime(c: FormControl): ValidationErrors {
        let dateValidators = new DateValidators();
        return dateValidators.requiredTime('start_time');
    }

    /*
        Function requiredEndTime(): required time
        Author: Lam
    */
    static requiredEndTime(c: FormControl): ValidationErrors {
        let dateValidators = new DateValidators();
        return dateValidators.requiredTime('end_time');
    }

    requiredTime(str_time){
        let getValTime = String($('#'+str_time).val());
        if(getValTime.indexOf(',') !== -1){
            getValTime = getValTime.substr(0,getValTime.indexOf(','));
        }
        if(getValTime === ''){
            return {
                'required_time': {
                    'message': 'Trường này không được bỏ trống'
                }
            };
        }
        return null;
    }

    /*
        Function formatStartDate(): validate format start date
        Author: Lam
    */
    static formatDate(c: FormControl): ValidationErrors {
        let validatePattern = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/;
        let getValDate = c.value;
        let dateValues = getValDate ? getValDate.match(validatePattern) : '';
        if(getValDate === ''){
            return null;
        }else if(dateValues === null){
            return {
                'fomatDate': {
                    'message': 'Định dạng ngày sai. Vui lòng chọn lại ngày dd/mm/yyyy'
                }
            };
        }
        return null;
    }

    /*
        Function validBirthDay(): validate day of month, month of year
        Author: Lam
    */
    static validBirthDay(c: FormControl): ValidationErrors {
        let checkDateValid = new CheckDateValid();
        const message = {
            'fomatDate': {
                'message': 'Vui lòng nhập ngày hợp lệ'
            }
        };
        let date = c.value;
        let is_valid = date ? checkDateValid.trimDate(date) : true;
        if(is_valid === true){
            return null;
        }
        return message;
    }
}