import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Post } from '../../../shared/class/post';
import { PostService } from '../../../shared/services/post.service';
import 'rxjs/add/observable/throw';

@Component({
    selector: 'form-post',
    templateUrl: './form-post.component.html',
    styleUrls: ['./form-post.component.css'],
    providers: [PostService]
})
export class FormPostComponent implements OnInit {

    /*
        author: Lam
    */

    // set inputImage property as a local variable, #inputImage on the tag input file
    @ViewChild('inputImage')
    inputImage: any;

    @Input() post: Post; // Get post from component parent

    formPost: FormGroup;

    errorMessage = ''; // Messages error

    constructor(
        private postService: PostService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
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
            post_type_id: [this.post.post_type_id, Validators.required],
            pin_to_top: [this.post.pin_to_top],
            key_query: [this.post.key_query, Validators.required],
        });
    }

    /*
        Function onFileChange(): Input file image to get base 64
        author: Lam
    */ 
    onFileChange(event): void{
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.formPost.get('image').setValue(reader.result.split(',')[1]);
            };
        }
    }

    /*
        Function clearFile(): Clear value input file image
        author: Lam
    */ 
    clearFile(): void {
        this.formPost.get('image').setValue(null);
        this.inputImage.nativeElement.value = "";
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
