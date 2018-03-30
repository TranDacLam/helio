import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Banner, positions } from '../../../shared/class/banner';
import { BannerService } from '../../../shared/services/banner.service';
import { ToastrService } from 'ngx-toastr';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { env } from '../../../../environments/environment';

// Using bootbox 
declare var bootbox:any;

@Component({
  selector: 'app-form-banner',
  templateUrl: './form-banner.component.html',
  styleUrls: ['./form-banner.component.css']
})
export class FormBannerComponent implements OnInit {

	banner: Banner;
    formBanner: FormGroup;

    positions = positions;

    lang: string = 'vi';
    api_domain:string = "";
    errorMessage: string = "";
    title: string = "";
    msg_clear_image: string = '';

    isSelected: boolean;

  	constructor(
  		private bannerService: BannerService,
  		private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
  		) {
  		this.api_domain = env.api_domain_root;
  	}

  	ngOnInit() {
  		this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });

        if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title = "Chỉnh Sửa Banner";
            this.getBannerById();
        } else {
            // Add new Form
            this.title = "Thêm Banner";
            this.banner = new Banner();
            this.isSelected = true;
            this.createForm();
        }
  	}
    /*
        Upload image
        FileReader: reading file contents
        @author: TrangLe
    */
    onFileChange(event) {
        let reader = new FileReader();
        let input_id = $(event.target).attr('id');
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formBanner.get(input_id).setValue({ filename: file.name, filetype: file.type, value: file });
        }
    }
    
  	getBannerById() {
  		const id = +this.route.snapshot.paramMap.get('id');
    	this.bannerService.getBannerById(id, this.lang)
    	.subscribe(
        	(banner) => {
                this.banner = banner;
                this.createForm();
            },
        	(error) =>  {
                this.router.navigate(['/error', { message: error }]);
            }
        );
  	}

  	createForm() {
        this.formBanner = this.fb.group({
            image: [this.banner.image],
            sub_url: [this.banner.sub_url, [Validators.required, Validators.maxLength(1000)]],
            position: [this.banner.position, [Validators.required]],
            is_show: [this.banner.is_show === true ? true : false],
            is_clear_image: [false]
        });
    }

    onSubmit() {
        if(this.formBanner.invalid){
            ValidateSubmit.validateAllFormFields(this.formBanner);
        } else {
            var self = this;
            let bannerFormGroup = this.convertFormGroupToFormData(this.formBanner);
            if(this.banner.id) {
                if(this.formBanner.value.is_clear_image === true && typeof(this.formBanner.value.image) != 'string'){
                    this.formBanner.get('is_clear_image').setValue(false);
                    this.msg_clear_image = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
                } else {
                	this.bannerService.updateBanner(bannerFormGroup, this.banner.id, this.lang).subscribe(
                        (data) => {
                            // Navigate to promotion page where success
                            this.toastr.success(`Chỉnh sửa ${this.formBanner.value['sub_url']} thành công`);
                            this.router.navigate(['/banner-list']);
                        }, 
                        (error) => {
                            if(error.code == 400) {
                                this.errorMessage = error.message
                            } else {
                               self.router.navigate(['/error', { message: error.message }]);
                            }
                        }
                    );
                }
            } else {
            	this.bannerService.CreateBanner(bannerFormGroup, this.lang).subscribe(
	                (result) => {
	                    self.toastr.success(`Thêm ${this.formBanner.value['sub_url']} thành công`);
	                    self.router.navigate(['/banner-list'])     
	                },
	                (error) =>  {
	                    if( error.code == 400 ){
	                        self.errorMessage = error.message
	                    } else {
	                        self.router.navigate(['/error', {message: error}])
	                    }
	                }
            	);
            } 
        }
    }

    deleteBanner() {
        const id = this.banner.id;
        this.bannerService.deleteUserById(id, this.lang).subscribe(
            (data) => {
                this.toastr.success(`Xóa ${this.banner.sub_url} thành công`);
                this.router.navigate(['/banner-list']);
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message }])
            }
        );
    }

    /*
        Convert form group to form data to submit form
        @author: diemnguyen
    */
    private convertFormGroupToFormData(formBanner: FormGroup) {
        // Convert FormGroup to FormData
        let bannerValues = formBanner.value;
        let bannerFormData:FormData = new FormData(); 
        if (bannerValues){
            /* 
                Loop to set value to formData
                Case1: if value is null then set ""
                Case2: If key is image field then set value have both file and name
                Else: Set value default
            */
            Object.keys(bannerValues).forEach(k => { 
                if(bannerValues[k] == null) {
                    bannerFormData.append(k, '');
                } else if (k === 'image') {
                    bannerFormData.append(k, bannerValues[k].value, bannerValues[k].name);
                } else {
                    bannerFormData.append(k, bannerValues[k]);
                }
            });
        }
        return bannerFormData;
    }

    confirmDelete(banner: Banner) {
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Banner này?",
            buttons: {
                    cancel: {
                        label: "HỦY"
                    },
                    confirm: {
                        label: "XÓA"
                    }
                },
            callback: (result)=> {
                if(result) {
                    // Check result = true. call function callback
                    this.deleteBanner()
                }
            }
        });
    }
}
