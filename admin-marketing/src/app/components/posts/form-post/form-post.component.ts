import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Post } from '../../../shared/class/post';
import { PostService } from '../../../shared/services/post.service';
import { PostType } from './../../../shared/class/post-type';
import { PostTypeService } from '../../../shared/services/post-type.service';
import 'rxjs/add/observable/throw';
import { env } from '../../../../environments/environment';

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
    multi_imgae: any;

    errorMessage = ''; // Messages error
    api_domain: string = '';

    constructor(
        private postService: PostService,
        private postTypeService: PostTypeService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute
    ) { 
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
        this.getPostTypes();
        this.creatForm();
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formPost = this.fb.group({
            name: [this.post.name, Validators.required],
            image: [this.post.image, Validators.required],
            short_description: [this.post.short_description, Validators.required],
            content: [this.post.content, Validators.required],
            post_type_id: [this.post.post_type_id ? this.post.post_type_id : '', Validators.required],
            pin_to_top: [this.post.pin_to_top ? this.post.pin_to_top : false],
            key_query: [this.post.key_query, Validators.required],
            is_clear_image: [false],
            is_clear_multi_image: [false]
        });
    }

    getPostTypes(){
        this.postTypeService.getPostTypes().subscribe(
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
        let reader = new FileReader();
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
        this.multi_imgae = [];
        let obj_image: any;
        if(event.target.files && event.target.files.length > 0) {
            for(let i = 0; i < event.target.files.length; i++){
                let file = event.target.files[i];
                obj_image = {
                    filename: file.name,
                    filetype: file.type,
                    value: file,
                }
                this.multi_imgae.push(obj_image);
            }
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
        if(!this.post.id){
            this.postService.addPost(this.formPost.value).subscribe(
                (data) => {
                    this.router.navigate(['/post/list', { message_post: this.formPost.value.name}]);
                },
                (error) => {
                    { this.errorMessage = error.message; } 
                }
            );
        }else {
            this.postService.updatePost(this.formPost.value, this.post.id).subscribe(
                (data) => {
                    this.post = data;
                    this.router.navigate(['/post/list', { message_put: this.formPost.value.name}]);
                },
                (error) => {
                    { this.errorMessage = error.message; } 
                }
            );
        }
        
    }

}
