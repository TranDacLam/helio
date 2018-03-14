import { Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { User } from '../../shared/class/user';
import { Role } from '../../shared/class/role';
import { UserPermissionService } from '../../shared/services/user-permission.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/throw';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.css'],
})
export class UserPermissionComponent implements OnInit {

  constructor( private userPermissionService: UserPermissionService) { }

  user_list_left: User[];
  user_list_right: User[];
  roles: Role[];
 @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions_left: any = {};
  dtOptions_right: any = {};
  dtTrigger: Subject<any> = new Subject();

  getUserRight(id: number){
  	this.userPermissionService.getUserRight(id).subscribe(
  		data =>{
        this.user_list_right = [];
  			this.user_list_right = data;
  		},
  		error =>{
          console.log(error);
  		}
  	)
  }
    
    rerender(){
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
      });
    }

  getUserLeft(){
  	this.userPermissionService.getUserLeft().subscribe(
  		data =>{
  			this.user_list_left = data;
  		},
  		error =>{
          console.log(error);

  		}
  	)
  }

  getRoles(){
  	this.userPermissionService.getRoles().subscribe(
  		data =>{
  			this.roles = data;
          if (data.length > 0){
            this.getUserRight(data[0].id);
          }
  		},
  		error =>{
          console.log(error);

  		}
  	)
  }
  setRoleUser( ){
        var list_id = [];
        this.user_list_right.forEach((item)=>{
          list_id.push(item.id);
        })
        var role_id = $('.role_checkbox:checked').val();
        this.userPermissionService.setRoleUser( list_id, role_id).subscribe(
          data =>{
            console.log(data);
          },
          error =>{
            console.log(error);
          }
        )
    

  }
  /*
        Event select All Button on header table
        @author: diemnguyen 
    */
    selectAllEventLeft(event) {
        this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows().every( function () {
                let row = this.node();
                if( event.target.checked ) {
                    $(row).addClass('selected');
                } else {
                    $(row).removeClass('selected');
                }
                $(row).find('input:checkbox').prop('checked', event.target.checked);
            });
        });
    }

    /*
        Event select All Button on header table
        @author: diemnguyen 
    */
    selectAllEventRight(event) {
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
          console.log(dtInstance);
            dtInstance.rows().every( function () {
                let row = this.node();
                console.log(row);
                if( event.target.checked ) {
                    $(row).addClass('selected');
                } else {
                    $(row).removeClass('selected');
                }
                $(row).find('input:checkbox').prop('checked', event.target.checked);
            });
        });
    }

    /*
        Event select checbox on row
            Case1: all row are checked then checkbox all on header is checked
            Case1: any row is not checked then checkbox all on header is not checked
        @author: diemnguyen 
    */
    selectCheckboxLeft(event) {   
        $(event.target).closest( "tr" ).toggleClass( "selected" );
        this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
            // Any row not selected then checked all button is not checked
            $('#select-all-left').prop('checked', dtInstance.rows('tr:not(.selected)').count() < 1);
        });
    }

    /*
        Event select checbox on row
            Case1: all row are checked then checkbox all on header is checked
            Case1: any row is not checked then checkbox all on header is not checked
        @author: diemnguyen 
    */
    selectCheckboxRight(event) {   
        $(event.target).closest( "tr" ).toggleClass( "selected" );
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            // Any row not selected then checked all button is not checked
            $('#select-all-right').prop('checked', dtInstance.rows('tr:not(.selected)').count() < 1);
        });
    }
    /*
        Move all row is checked to right tatble
        @author: diemnguyen
    */
    move_right(): void {
        let selected_temp: any;
        this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
            selected_temp = dtInstance.rows( '.selected' ).data();
            dtInstance.rows('.selected').remove().draw(); 
            console.log(selected_temp) ;          
        });
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
             dtInstance.rows.add(selected_temp).draw();
        });
    }
    /*
        Move all row is checked to left tatble
        @author: diemnguyen
    */
    move_left(): void {
        let selected_temp: any;
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            selected_temp = dtInstance.rows( '.selected' ).data();
            dtInstance.rows('.selected').remove().draw();
        });

        this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
             dtInstance.rows.add(selected_temp).draw();
        });
    }
  ngOnInit() {
  	this.getRoles();
  	this.getUserLeft();
    this.dtOptions_left = {
            pagingType: "full_numbers",
            columnDefs: [{
                orderable: false,
                className: "dt-center",
                targets: 0
            }], 
            order: [[ 1, 'asc' ]],
            scrollX: true,
            language: {
                sSearch: "",
                searchPlaceholder: "Nhập thông tin tìm kiếm",
                lengthMenu: "Hiển thị _MENU_ dòng",
                sZeroRecords:  "Không tìm thấy dòng nào phù hợp",
                info: "Hiển thị _START_ đến _END_ của _TOTAL_",
                paginate: {
                    'first': "Đầu",
                    'last': "Cuối",
                    'next': "Sau",
                    'previous': "Trước"
                }
            },
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                $('td', row).find('input:checkbox').off().bind('change', event => {
                    this.selectCheckboxLeft(event);
                });
                return row;
            },
        }

        this.dtOptions_right = {
            pagingType: "full_numbers",
            columnDefs: [{
                orderable: false,
                className: "dt-center",
                targets: 0
            }], 
            order: [[ 1, 'asc' ]],
            scrollX: true,
            language: {
                sSearch: "",
                searchPlaceholder: "Nhập thông tin tìm kiếm",
                lengthMenu: "Hiển thị _MENU_ dòng",
                sZeroRecords:  "Không tìm thấy dòng nào phù hợp",
                info: "Hiển thị _START_ đến _END_ của _TOTAL_",
                paginate: {
                    'first': "Đầu",
                    'last': "Cuối",
                    'next': "Sau",
                    'previous': "Trước"
                }
            },
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
                $('td', row).find('input:checkbox').off().bind('change', () => {
                    this.selectCheckboxRight(event);
                });
                return row;
            }
        }  
  }

}
