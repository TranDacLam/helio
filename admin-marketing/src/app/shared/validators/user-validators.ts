import { FormControl, FormBuilder, FormArray, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

export class UserValidators {

	static passwordValidators(c: FormControl): ValidationErrors {
		let passRegx = /^(?=.*\d).{8,32}$/;
		let passVal = String($('#password').val());
		let passValues = passVal.match(passRegx);
		if(passValues === null && passVal !== '') {
			return {
                'passwordValidate': {
                    'message': 'Mật khẩu phải dài từ 8 đến 32 chữ số và bao gồm ít nhất một chữ số.'
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
					'message': 'Vui lòng nhập số điện thoại hợp lệ.'
				}
			};
		}
		return null;	
	}

	static emailValidators(fc: FormControl):ValidationErrors {
		let emailRegx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		let email = fc.value;
		let emailValue = email ? email.match(emailRegx): '';

		if(emailValue === null && email !== '') {
			return {
				'emailValidate': {
					'message': 'Vui lòng nhập địa chỉ email hợp lệ.'
				}
			}
		}
		return null;
	}

	static birtdateValidators(fc: FormControl): ValidationErrors {
		let birtdate = $('#birth_date').val() ? moment($('#birth_date').val(), "DD/MM/YYYY").toDate() : '';
		var today = new Date();
		if (birtdate > today) {
			return {
				'birtdateValidate': {
					'message': 'Vui lòng chọn ngày sinh nhỏ hơn ngày hiện tại'
				}
			}
		}
		return null;
	}
}

