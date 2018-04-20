import { FormControl, FormBuilder, FormArray, ValidationErrors } from '@angular/forms';

export class DenominationValidators {

	static denominationValidators(c: FormControl): ValidationErrors {
		let denomiRegx = /^[0-9,]+$/;
		let denomiVal = c.value;
		let denomiValues = denomiVal.match(denomiRegx);
		if(denomiValues === null && denomiVal !== '') {
			return {
                'denominationValidate': {
                    'message': 'Vui lòng nhập mệnh giá tiền hợp lệ.'
                }
            };
		}
		if(denomiVal == 0) {
			return {
                'denominationValidate': {
                    'message': 'Vui lòng nhập mệnh giá tiền lớn hơn 0.'
                }
            };
		}
        return null;	
	}
}