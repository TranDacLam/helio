import { FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';


export class ImageValidators {

    /*
        Function validateFile(): validate iamge accept jpg, jpeg, png, ico, bmp
        Author: Lam
    */
    static validateFile(c: FormControl) {
        if(c.value){
            let name = c.value.filename;
            let extension = {'jpg': true, 'jpeg': true, 'png': true, 'ico': true, 'bmp': true, 'gif': true}
            let ext = name.substring(name.lastIndexOf('.') + 1);
            if (ext.toLowerCase() in extension) {
                return null;
            }
            return {
                'fomatFile': {
                    'message': 'Vui lòng tải tệp lên với các định dạng này (jpg, jpeg, png, ico, bmp)'
                }
            };
        }
    }
}