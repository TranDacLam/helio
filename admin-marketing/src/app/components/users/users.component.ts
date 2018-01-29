import { Component, OnInit } from '@angular/core';
import { User } from './user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public ckeditorContent: string = '';
  public ckeConfig = {};

  user: User = {
      id: 1,
      name: "TienDht"
  }


  constructor() { }

  ngOnInit() {
    this.ckeConfig = {
      height: 400,
      language: 'vi',
      filebrowserBrowseUrl : 'http://127.0.0.1:8000/ckeditor/browse/', //TODO
      filebrowserUploadUrl : 'http://127.0.0.1:8000/ckeditor/upload/' //TODO
    };
  }
}
