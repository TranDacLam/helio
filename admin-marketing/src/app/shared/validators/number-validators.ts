import { FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';


export class NumberValidators {

    /*
        Function validPhone(): validate phone
        Author: Lam
    */
    static validPhone(c: FormControl):ValidationErrors {
        // Allows only numerals betwen 
        let phoneRegx = /^(\d{10,11})$/;
        let phone = c.value;
        let phoneValues = phone ? phone.match(phoneRegx) : '';

        if(phoneValues === null && phone !== '') {
            return {
                'phoneValidate': {
                    'message': 'Số điện thoại không hợp lệ'
                }
            };
        }
        return null;    
    }

    /*
        Function validPersonID(): validate persion ID
        Author: Lam
    */
    static validPersonID(c: FormControl):ValidationErrors {
        // Allows only numerals betwen 
        let personIDRegx =  /^(\d{9})$/;
        let personID = c.value;
        let personIDValues = personID ? personID.match(personIDRegx) : '';

        if(personIDValues === null && personID !== '') {
            return {
                'phoneValidate': {
                    'message': 'Chứng minh nhân dân không hợp lệ'
                }
            };
        }
        return null;    
    }
}