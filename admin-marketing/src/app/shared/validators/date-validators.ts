import { FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';


export class DateValidators {

    /*
        Function checkDate(): validate start date and end date
        Author: Lam
    */
    static checkDate(c: FormControl): ValidationErrors {
        if(c.dirty){
            const message = {
                'fomatDate': {
                    'message': 'Vui lòng nhập ngày kết thúc lớn hơn hoặc bằng ngày bắt đầu'
                }
            };
            let start = $('#start_date').val() ? moment($('#start_date').val(), "DD/MM/YYYY").toDate() : '';
            let end = $('#end_date').val() ? moment($('#end_date').val(), "DD/MM/YYYY").toDate() : '';
            if(start <= end || start === '' || end === ''){
                return null;
            }
            return message;
        }
    }

    /*
        Function checkTime(): validate start date and end date
        Author: Lam
    */
    static checkTime(c: FormControl): ValidationErrors {
        if(c.dirty){
            const message = {
                'fomatDate': {
                    'message': 'Vui lòng nhập thời gian kết thúc lớn hơn thời gian bắt đầu'
                }
            };
            let start_date = $('#start_date').val() ? $('#start_date').val() : '';
            let end_date = $('#end_date').val() ? $('#end_date').val() : '';
            let start_time = $('#start_time').val() ? moment($('#start_time').val(), 'HH:mm').toDate() : '';
            let end_time = $('#end_time').val() ? moment($('#end_time').val(), 'HH:mm').toDate() : '';
            if(start_date === end_date && start_time >= end_time){
                return message;
            }
            return null;
        }
    }

    /*
        Function formatStartDate(): validate format start date
        Author: Lam
    */
    static formatStartDate(c: FormControl): ValidationErrors {
        if(c.dirty){
            let validatePattern = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/;
            let getValDate = String($('#start_date').val());
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
    }

    /*
        Function formatEndDate(): validate format end date
        Author: Lam
    */
    static formatEndDate(c: FormControl): ValidationErrors {
        if(c.dirty){
            let validatePattern = /^(\d{1,2})(\/)(\d{1,2})(\/)(\d{4})$/;
            let getValDate = String($('#end_date').val());
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
    }

    /*
        Function requiredStartDate(): validate required start date
        Author: Lam
    */
    static requiredStartDate(c: FormControl): ValidationErrors {
        let getValDate = String($('#start_date').val());
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
        Function requiredEndDate(): validate required end date
        Author: Lam
    */
    static requiredEndDate(c: FormControl): ValidationErrors {
        let getValDate = String($('#end_date').val());
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
        let validatePattern = /^(\d{1,2})(:)(\d{2})$/;
        let getValTime = String($('#start_time').val());
        if(getValTime.indexOf(',') !== -1){
            getValTime = getValTime.substr(0,getValTime.indexOf(','));
        }
        let timeValues = getValTime.match(validatePattern);
        if(getValTime === ''){
            return {
                'required_time': {
                    'message': 'Trường này không được bỏ trống'
                }
            };
        }else if(timeValues === null){
            return {
                'fomatDate': {
                    'message': 'Định dạng thời gian sai. Vui lòng chọn lại thời gian HH:mm'
                }
            };
        }
        return null;
    }

    /*
        Function formatEndTime(): validate format end time
        Author: Lam
    */
    static formatEndTime(c: FormControl): ValidationErrors {
        let validatePattern = /^(\d{1,2})(:)(\d{2})$/;
        let getValTime = String($('#end_time').val());
        if(getValTime.indexOf(',') !== -1){
            getValTime = getValTime.substr(0,getValTime.indexOf(','));
        }
        let timeValues = getValTime.match(validatePattern);
        if(getValTime === ''){
            return {
                'required_time': {
                    'message': 'Trường này không được bỏ trống'
                }
            };
        }else if(timeValues === null){
            return {
                'fomatDate': {
                    'message': 'Định dạng thời gian sai. Vui lòng chọn lại thời gian HH:mm'
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
}