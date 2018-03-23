import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Post } from '../../../shared/class/post';
import { PostService } from '../../../shared/services/post.service';
import { PostType } from './../../../shared/class/post-type';
import { PostTypeService } from '../../../shared/services/post-type.service';
import { PostImage } from './../../../shared/class/post-image';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import { ToastrService } from 'ngx-toastr';
import { env } from '../../../../environments/environment';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'form-post',
    templateUrl: './form-post.component.html',
    styleUrls: ['./form-post.component.css'],
    providers: [PostService, PostTypeService]
})
export class FormPostComponent implements OnInit {

    /*
        author: Lam
    */

    @Input() post: Post; // Get post from component parent

    formPost: FormGroup;
    post_types: PostType[];

    errorMessage: any; // Messages error
    msg_clear_image = '';
    api_domain: string = '';
    lang = 'vi';

    constructor(
        private postService: PostService,
        private postTypeService: PostTypeService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
    ) { 
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
        this.getPostTypes();
        this.creatForm();
        // get params url
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formPost = this.fb.group({
            name: [this.post.name, [Validators.required, Validators.maxLength(255)]],
            image: [this.post.image, [Validators.maxLength(1000)]],
            short_description: [this.post.short_description, [Validators.required, Validators.maxLength(350)]],
            content: [this.post.content, Validators.required],
            post_type: [this.post.post_type ? this.post.post_type : '', Validators.required],
            pin_to_top: [this.post.pin_to_top ? this.post.pin_to_top : false],
            key_query: [this.post.key_query, [Validators.required, Validators.maxLength(255)]],
            is_clear_image: [false],
            posts_image: [this.post.posts_image]
        });
    }

    getPostTypes(){
        this.postTypeService.getPostTypes(this.lang).subscribe(
            (data) => {
                this.post_types = data;
            } 
        );
    }

    /*
        Function onFileChange(): Input file image to get base 64
        author: Lam
    */ 
    onFileChange(event): void{
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formPost.get('image').setValue({
                filename: file.name,
                filetype: file.type,
                value: file,
            });
        }
    }

    /*
        Function onFileMultipleChange(): Input multiple file image to get base 64
        author: Lam
    */ 
    onFileMultipleChange(event): void{
        let multi_imgae = [];
        let obj_image: any;
        if(event.target.files && event.target.files.length > 0) {
            for(let i = 0; i < event.target.files.length; i++){
                let file = event.target.files[i];
                obj_image = {
                    image: {
                        filename: file.name,
                        filetype: file.type,
                        value: file,
                    }
                }
                multi_imgae.push(obj_image);
            }
            this.formPost.value.posts_image = multi_imgae;
        }
    }

    /*
        Function onSubmit():
         + Step 1: Check post id
         + Step 2:  
            * TH1:  + Id empty then call service function addHPost() to add Post, 
                    + Later, redirect list post with message
            * TH2:  + Id exist then call service function updatePost() to update Post
                    + Later, redirect list post with message
        author: Lam
    */
    onSubmit(): void{
        if(this.formPost.invalid){
            ValidateSubmit.validateAllFormFields(this.formPost);
        }else{
            this.formPost.value.post_type = parseInt(this.formPost.value.post_type);
            let post_form_data = this.convertFormGroupToFormData(this.formPost);
            let value_form = this.formPost.value;
            if(!this.post.id){
                this.postService.addPost(post_form_data, this.lang).subscribe(
                    (data) => {
                        this.toastr.success(`Thêm mới "${value_form.name}" thành công`);
                        this.router.navigate(['/post/list']);
                    },
                    (error) => {
                        if(error.code === 400){
                            this.errorMessage = error.message;
                        }else{
                            this.router.navigate(['/error', { message: error.message}]);
                        }
                    }
                );
            }else {
                this.postService.updatePost(post_form_data, this.post.id, this.lang).subscribe(
                    (data) => {
                        this.post = data;
                        this.toastr.success(`Chỉnh sửa "${value_form.name}" thành công`);
                        this.router.navigate(['/post/list']);
                    },
                    (error) => {
                        if(error.code === 400){
                            this.errorMessage = error.message;
                        }else{
                            this.router.navigate(['/error', { message: error.message}]);
                        }
                    }
                );
            }
        }
    }

    /*
        Function deletePostEvent(): confirm delete
        @author: Lam
    */
    deletePostEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn",
            message: "Bạn muốn xóa bài viết này?",
            buttons: {
                cancel: {
                    label: "Hủy"
                },
                confirm: {
                    label: "Xóa"
                }
            },
            callback: function (result) {
                if(result) {
                    that.onDelete();
                }
            }
        });
    }

    /*
        Function onDelete():
         + Get id from url path
         + Call service function onDelPost() by id to delete event
        Author: Lam
    */
    onDelete(): void {
        const id = this.post.id;
        this.postService.onDelPost(id, this.lang).subscribe(
            (data) => {
                this.toastr.success(`Xóa "${this.formPost.value.name}" thành công`);
                this.router.navigate(['/post/list']);
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

    /*
        Convert form group to form data to submit form
        @author: lam
    */
    private convertFormGroupToFormData(promotionForm: FormGroup) {
        // Convert FormGroup to FormData
        let promotionValues = promotionForm.value;
        let promotionFormData:FormData = new FormData(); 
        if (promotionValues){
            /* 
                Loop to set value to formData
                Case1: if value is null then set ""
                Case2: If key is image field then set value have both file and name
                Else: Set value default
            */
            Object.keys(promotionValues).forEach(k => { 
                if(promotionValues[k] == null) {
                    promotionFormData.append(k, '');
                } else if (k === 'image') {
                    promotionFormData.append(k, promotionValues[k].value, promotionValues[k].name);
                } else if(k === 'posts_image'){
                    Object.keys(promotionValues[k]).forEach(l => { 
                        promotionFormData.append('posts_image', promotionValues[k][l].image.value);
                    });
                } else {
                    promotionFormData.append(k, promotionValues[k]);
                }
            });
        }
        return promotionFormData;
    }

}
