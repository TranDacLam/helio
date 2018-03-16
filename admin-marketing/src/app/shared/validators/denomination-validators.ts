import { FormControl, FormBuilder, FormArray, ValidationErrors } from '@angular/forms';

export class DenominationValidators {

	static denominationValidators(c: FormControl): ValidationErrors {
		let denomiRegx = /^[0-9,]+$/;
		let denomiVal = String($('#denomination').val());
		let denomiValues = denomiVal.match(denomiRegx);
		if(denomiValues === null && denomiVal !== '') {
			return {
                'denominationValidate': {
                    'message': 'Vui lòng nhập mệnh giá tiền hợp lệ.'
                }
            };
		}
        return null;	
	}
}