import { Component, OnInit } from '@angular/core';
import { User } from './user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  public this.ckeConfig;

  user: User = {
      id: 1,
      name: "TienDht"
  }

  constructor() { }

  ngOnInit() {
    this.ckeConfig = {
      height: 400,
      language: 'vi',
      filebrowserBrowseUrl : 'http://127.0.0.1:8000/ckeditor/upload/', //TODO
      filebrowserUploadUrl : 'http://127.0.0.1:8000/ckeditor/upload/' //TODO
    };
  }
}
