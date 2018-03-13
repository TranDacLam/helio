import { FormControl, FormBuilder, FormArray, ValidationErrors } from '@angular/forms';

export class UserValidators {

	static passwordValidators(c: FormControl): ValidationErrors {
		let passRegx = /^(?=.*\d).{8,32}$/;
		let passVal = String($('#password').val());
		let passValues = passVal.match(passRegx);
		if(passValues === null && passVal !== '') {
			return {
                'passwordValidate': {
                    'message': 'Password must be between 8 and 32 digits long and include at least one numeric digit.'
                }
            };
		}
        return null;	
	}

	static phoneValidators(fc: FormControl):ValidationErrors {

		// Allows only numerals betwen 
		let phoneRegx = /^[0-9].{9,10}$/;
		let phone = String($('#phone').val());
		let phoneValues = phone.match(phoneRegx);

		if(phoneValues === null && phone !== '') {
			return {
				'phoneValidate': {
					'message': 'Please enter number phone valid'
				}
			};
		}
		return null;	
	}
}

