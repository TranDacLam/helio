import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../../shared/class/post';
import { PostService } from '../../../shared/services/post.service';

@Component({
    selector: 'app-edit-post',
    templateUrl: './edit-post.component.html',
    styleUrls: ['./edit-post.component.css'],
    providers: [PostService]
})
export class EditPostComponent implements OnInit {

    post: Post;

    constructor(
        private postService: PostService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.getPost();
    }

    /*
        Function getPost():
         + Get id from url path
         + Callback service function getPost() by id
        Author: Lam
    */
    getPost(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.postService.getPost(id).subscribe(
            (data) => {
                this.post = data;
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

}
