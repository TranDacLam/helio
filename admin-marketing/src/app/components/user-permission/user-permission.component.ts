import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/class/user';
import { Role } from '../../shared/class/role';
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

  user_list_left: User[];
  user_list_right: User[];
  roles: Role[];

  getUserRight(id: number){
  	this.userPermissionService.getUserRight(id).subscribe(
  		data =>{
  			this.user_list_right = data;
  		},
  		error =>{

  		}
  	)
  }
  getUserLeft(){
  	this.userPermissionService.getUserLeft().subscribe(
  		data =>{
  			this.user_list_left = data;
  		},
  		error =>{

  		}
  	)
  }

  getRoles(){
  	this.userPermissionService.getRoles().subscribe(
  		data =>{
  			this.roles = data;
  		},
  		error =>{

  		}
  	)
  }
  
  ngOnInit() {
  	this.getRoles();
    this.getUserRight(1);
  	this.getUserLeft();
  }

}
