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

    /*
        Function validDate(): validate day of month, month of year
        Author: Lam
    */
    validDate(message_error, str_date){
        let checkDateValid = new CheckDateValid();
        const message = {
            'fomatDate': {
                'message': message_error
            }
        };
        // Get date by #id
        let date = $('#'+str_date).val() ? String($('#'+str_date).val()) : '';
        // Check date valid 
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

    /*
        Function validTime(): check valid time
        Author: Lam
    */
    validTime(message_error, str_time){
        const message = {
            'fomatDate': {
                'message': message_error
            }
        };
        // get time by #id
        let time = $('#'+str_time).val() ? String($('#'+str_time).val()) : '';
        // handle case get time is 08:21, 2018
        if(time.indexOf(',') !== -1){
            time = time.substr(0,time.indexOf(','));
        }
        // time exist
        if(time){
            // get hours from time
            let hours = parseInt(time.substring(0, time.indexOf(":")));
            // get minute from time
            let minute = parseInt(time.substring(time.indexOf(":")+1));
            // check hour and minute
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

    /*
        Function formatInputDate(): validate format date
        Author: Lam
    */
    formatInputDate(str_date) {
        // format date is dd/mm/yyyy
        let validatePattern = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/;
        // get date by #id
        let getValDate = String($('#'+str_date).val());
        // match to check date have correct format
        let dateValues = getValDate.match(validatePattern);
        // skip casse date is ''
        if(getValDate === ''){
            return null;
        }else if(dateValues === null){ // case date is null
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

    /*
        Function requiredDate(): validate required date
        Author: Lam
    */
    requiredDate(str_date) {
        // get date by #id
        let getValDate = String($('#'+str_date).val());
        // check date
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

    /*
        Function formatEndTime(): validate format time
        Author: Lam
    */
    formatTime(str_time) {
        // format time is HH:mm
        let validatePattern = /^(\d{1,2})(:)(\d{2})$/;
        // get time by #id
        let getValTime = String($('#'+str_time).val());
        // handle case get time is 08:21, 2018
        if(getValTime.indexOf(',') !== -1){
            getValTime = getValTime.substr(0,getValTime.indexOf(','));
        }
        // match to check time have correct format
        let timeValues = getValTime.match(validatePattern);
        // case time val is '' or time match let skip
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
        Function requiredStartTime(): required start time
        Author: Lam
    */
    static requiredStartTime(c: FormControl): ValidationErrors {
        let dateValidators = new DateValidators();
        return dateValidators.requiredTime('start_time');
    }

    /*
        Function requiredEndTime(): required end time
        Author: Lam
    */
    static requiredEndTime(c: FormControl): ValidationErrors {
        let dateValidators = new DateValidators();
        return dateValidators.requiredTime('end_time');
    }

    /*
        Function requiredTime(): required time
        Author: Lam
    */
    requiredTime(str_time){
        // get time by #id
        let getValTime = String($('#'+str_time).val());
        // handle case get time is 08:21, 2018
        if(getValTime.indexOf(',') !== -1){
            getValTime = getValTime.substr(0,getValTime.indexOf(','));
        }
        // check time val === ''
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
        // format date is dd/mm/yyyy
        let validatePattern = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/;
        // get value use control
        let getValDate = c.value;
        // match to check date have correct format
        let dateValues = getValDate ? getValDate.match(validatePattern) : '';
        // Check date value is '' let skip
        if(getValDate === ''){
            return null;
        }else if(dateValues === null){ // case date is null
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
        // get value use control
        let date = c.value;
        // check date valid
        let is_valid = date ? checkDateValid.trimDate(date) : true;
        if(is_valid === true){
            return null;
        }
        return message;
    }

    /*
        Function dateTimeLessThan(): validate date, time
        Author: Lam
    */
    static dateTimeLessThan(){
        return (group: FormGroup): {[key: string]: any} => {
            let start_date = $('#start_date').val() ? $('#start_date').val() : '';
            let end_date = $('#end_date').val() ? $('#end_date').val() : '';
            let start_time = $('#start_time').val() ? moment($('#start_time').val(), 'HH:mm').toDate() : '';
            let end_time = $('#end_time').val() ? moment($('#end_time').val(), 'HH:mm').toDate() : '';
            if(start_date !== '' && end_date !== ''){
                if(moment(start_date, "DD/MM/YYYY").toDate() > moment(end_date, "DD/MM/YYYY").toDate()){
                    return {
                        dates: "Vui lòng nhập ngày kết thúc lớn hơn hoặc bằng ngày bắt đầu"
                    };
                }
                if(start_date === end_date && start_time >= end_time){
                    return {
                        times: "Vui lòng nhập thời gian kết thúc lớn hơn thời gian bắt đầu"
                    };
                }
            }
            
            return {};
        }
    }    
}