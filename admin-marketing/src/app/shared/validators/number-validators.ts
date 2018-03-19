import { FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';


export class NumberValidators {

    static validPhone(c: FormControl):ValidationErrors {
        // Allows only numerals betwen 
        let phoneRegx = /^(\d{10,11})$/;
        let phone = c.value;
        let phoneValues = phone ? phone.match(phoneRegx) : '';

        if(phoneValues === null && phone !== '') {
            return {
                'phoneValidate': {
                    'message': 'Vui lòng nhập số điện thoại hợp lệ'
                }
            };
        }
        return null;    
    }

    static validPersonID(c: FormControl):ValidationErrors {

        // Allows only numerals betwen 
        let personIDRegx =  /^(\d{9})$/;
        let personID = c.value;
        let personIDValues = personID ? personID.match(personIDRegx) : '';

        if(personIDValues === null && personID !== '') {
            return {
                'phoneValidate': {
                    'message': 'Vui lòng nhập số chứng minh nhân dân hợp lệ'
                }
            };
        }
        return null;    
    }
}