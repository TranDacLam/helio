import { Component, OnInit } from '@angular/core';
import { Post } from '../../../shared/class/post';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

    post: Post = new Post(); // create object event

    constructor() { }

    ngOnInit() {
    }

}
