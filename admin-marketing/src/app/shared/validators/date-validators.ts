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

    /*
        Function formatStartDate(): validate format start date
        Author: Lam
    */
    static formatStartDate(c: FormControl): ValidationErrors {
        if(c.dirty){
            let validatePattern = /^(\d{1,2})(\/|)(\d{1,2})(\/|)(\d{4})$/;
            let getValDate = String($('#start_date').val());
            let dateValues = getValDate.match(validatePattern);
            if(getValDate === ''){
                return null;
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

    /*
        Function formatEndDate(): validate format end date
        Author: Lam
    */
    static formatEndDate(c: FormControl): ValidationErrors {
        if(c.dirty){
            let validatePattern = /^(\d{1,2})(\/|)(\d{1,2})(\/|)(\d{4})$/;
            let getValDate = String($('#end_date').val());
            let dateValues = getValDate.match(validatePattern);
            if(getValDate === ''){
                return null;
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

    /*
        Function requiredStartDate(): validate required start date
        Author: Lam
    */
    static requiredStartDate(c: FormControl): ValidationErrors {
        let getValDate = String($('#start_date').val());
        if(getValDate === ''){
            return {
                'required_date': {
                    'message': 'Trường này bắt buộc'
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
                    'message': 'Trường này bắt buộc'
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