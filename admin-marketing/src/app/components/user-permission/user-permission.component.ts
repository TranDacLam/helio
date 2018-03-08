import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/class/user';
import { UserPermissionService } from '../../shared/services/user-permission.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/throw';


@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.css']
})
export class UserPermissionComponent implements OnInit {

  constructor( private userPermissionService: UserPermissionService) { }

  
  
  ngOnInit() {
  }

}
