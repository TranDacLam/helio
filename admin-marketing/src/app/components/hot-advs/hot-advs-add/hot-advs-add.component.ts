import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HotAdvs } from '../../../shared/class/hot-advs';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { HotAdvsService } from '../../../shared/services/hot-advs.service';
import { ToastrService } from 'ngx-toastr';
import * as ckeditor_config from './../../../shared/commons/ckeditor_config';
import { ScrollTop } from './../../../shared/commons/scroll-top';

import { Router, ActivatedRoute } from "@angular/router";
import { env } from '../../../../environments/environment';

// Using bootbox 
declare var bootbox: any;

@Component({
    selector: 'app-hot-advs-add',
    templateUrl: './hot-advs-add.component.html',
    styleUrls: ['./hot-advs-add.component.css'],
    providers: [HotAdvsService]
})
export class HotAdvsAddComponent implements OnInit {

    formHotAds: FormGroup; // formHotAdvs is tyoe of FormGroup
    hot_ads: HotAdvs;

    errorMessage: string = '';

    ckEditorConfig: any;
    title: string = "";
    msg_clear_image: string = '';
    api_domain: string = "";

    constructor(
        private fb: FormBuilder,
        private hotAdvsService: HotAdvsService,
        private router: Router,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private scrollTop: ScrollTop,
    ) { 
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {

        this.ckEditorConfig = ckeditor_config.config;

        if (this.route.snapshot.paramMap.get('id')) {
            // Update Init Form
            this.title = "Chỉnh Sửa Hot Ads";
            this.getHotAds();
        } else {
            // Add new Form
            this.title = "Thêm Hot Ads";
            this.hot_ads = new HotAdvs();
            this.creatForm();
        }
    }

    // Create form to add Hot advs
    creatForm(): void {
        this.formHotAds = this.fb.group({
            name: [this.hot_ads.name, [Validators.required, Validators.maxLength(255)]],
            content: [this.hot_ads.content, [Validators.required]],
            image: [this.hot_ads.image],
            is_register: [this.hot_ads.is_register === true ? true : false],
            is_view_detail: [this.hot_ads.is_view_detail === true ? true : false],
            sub_url_register: [this.hot_ads.sub_url_register],
            sub_url_view_detail: [this.hot_ads.sub_url_view_detail],
            is_draft: [this.hot_ads.is_draft === true ? true : false],
            is_clear_image: [false]
        });
    }

    /*
        Upload image
        FileReader: reading file contents
        @author: TrangLe
    */
    onFileChange(event) {
        let reader = new FileReader();
        let input_id = $(event.target).attr('id');
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formHotAds.get(input_id).setValue({ filename: file.name, filetype: file.type, value: file });
        }
    }

    /*
        GET: get Hot Advs By Id
        @author: Trangle
     */
    getHotAds() {
        const id = +this.route.snapshot.paramMap.get('id');
        this.hotAdvsService.getHotAdsById(id).subscribe(
            (data) => {
                this.hot_ads = data;
                this.creatForm();
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message }]);
            }
        );
    }
    /*
        Function create hot ads
        Convert formHotAds to Form Data
        Check formHotAdvs invalid true => Call ValidateSumit show error
        formHotAds valid call CreateHotAdvs from hot_advs.service
        Success: nagivate hot-advs-list and show success message
        Fail: return error
        @author: Trangle
     */
    onSubmit() {
        var self = this;
        let hotAdvsFormGroup = this.convertFormGroupToFormData(this.formHotAds);
        if (this.formHotAds.invalid) {
            this.scrollTop.scrollTopFom();
            // Call ValidateSubmit form ../shared/validators/validate-submit
            ValidateSubmit.validateAllFormFields(this.formHotAds);
        } else {
            if(this.hot_ads.id){
                if (this.formHotAds.value.is_clear_image === true && typeof (this.formHotAds.value.image) != 'string') {
                    // Set value is_clear_image
                    this.formHotAds.get('is_clear_image').setValue(false);
                    // Show msg_clear_image when error file or choose both is_clear_image and file
                    this.scrollTop.scrollTopFom();
                    this.msg_clear_image = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
                } else {
                    this.hotAdvsService.updateHotAds(hotAdvsFormGroup, this.hot_ads.id).subscribe(
                        (result) => {
                            this.toastr.success(`Chỉnh sửa ${this.formHotAds.value['name']} Hot Ads thành công`);
                            self.router.navigate(['/hot-advs-list'])
                        },
                        (error) => {
                            if (error.code == 400) {
                                this.scrollTop.scrollTopFom();
                                self.errorMessage = error.message
                            } else {
                                this.router.navigate(['/error', { message: error.message }]);
                            }
                        }
                    )
                }
            }else{
                this.hotAdvsService.CreateHotAdvs(hotAdvsFormGroup).subscribe(
                    (result) => {
                        this.toastr.success(`Thêm ${this.formHotAds.value['name']} Hot Ads thành công`);
                        self.router.navigate(['/hot-advs-list'])
                    },
                    (error) => {
                        if (error.code == 400) {
                            this.scrollTop.scrollTopFom();
                            self.errorMessage = error.message
                        } else {
                            this.router.navigate(['/error', { message: error.message }]);
                        }
                    }
                )
            }  
        }
    }

    /*
        Confirm delete hot ads detail
        @author: trangle
    */
    confirmDelete(hotAds: HotAdvs) {
        bootbox.confirm({
            title: "Bạn có chắc chắn?",
            message: "Bạn muốn xóa Hot Ads này?",
            buttons: {
                cancel: {
                    label: "HỦY"
                },
                confirm: {
                    label: "XÓA"
                }
            },
            callback: (result) => {
                if (result) {
                    // Check result = true. call function callback
                    this.deleteHotAds()
                }
            }
        });
    }

    /*
        DELETE: Delete Hot Ads By Id
        @author: Trangle
     */
    deleteHotAds() {
        const id = this.hot_ads.id;
        this.hotAdvsService.deleteHotAdsById(id).subscribe(
            () => {
                this.toastr.success(`Xóa ${this.hot_ads.name} thành công`);
                this.router.navigate(['/hot-advs-list'])
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message }]);
            }
        )
    }
    /*
        Convert form group to form data to submit form
        @author: Trangle
    */
    private convertFormGroupToFormData(hotAdvsForm: FormGroup) {
        // Convert FormGroup to FormData
        let hotAdvsValues = hotAdvsForm.value;
        let hotAdvsFormData: FormData = new FormData();
        if (hotAdvsValues) {
            /* 
                Loop to set value to formData
                Case1: if value is null then set ""
                Case2: If key is image field then set value have both file and name
                Else: Set value default
            */
            Object.keys(hotAdvsValues).forEach(k => {
                if (hotAdvsValues[k] == null) {
                    hotAdvsFormData.append(k, '');
                } else if (k === 'image') {
                    hotAdvsFormData.append(k, hotAdvsValues[k].value, hotAdvsValues[k].name);
                } else {
                    hotAdvsFormData.append(k, hotAdvsValues[k]);
                }
            });
        }
        return hotAdvsFormData;
    }

    /*
        Remove error message when click input tag
        @author: Trangle
     */
    removeErrorMessage() {
        this.errorMessage = '';
    }
}
