import { Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { User } from '../../shared/class/user';
import { Role } from '../../shared/class/role';
import { UserPermissionService } from '../../shared/services/user-permission.service';
import { Location } from '@angular/common';
import 'rxjs/add/observable/throw';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.css'],
})
export class UserPermissionComponent implements OnInit {

  constructor( private userPermissionService: UserPermissionService, private router:Router) { }

  user_list_left: User[];
  user_list_right: User[];
  roles: Role[];
 @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtOptions_left: any = {};
  dtOptions_right: any = {};
  dtTrigger_left: Subject<any> = new Subject();
  dtTrigger_right: Subject<any> = new Subject();
  // check 2 button move is checked, if checked reload left table
  move_is_click: boolean = false;

  /*
      Event get User in table right
      @author: hoangnguyen 
  */
  getUserRight(id: number){
  	this.userPermissionService.getUserRight(id).subscribe(
  		data =>{
        // reload datatable
        let self = this;
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            self.user_list_right = [];
            self.user_list_right = data;
            dtInstance.clear().draw();
            dtInstance.destroy();
            self.dtTrigger_right.next();
        });
        // if button move is click, reload table left
        if (this.move_is_click){
          this.move_is_click = false;
          this.getUserLeft();
        }
  		},
  		error =>{
        this.router.navigate(['/error', { message: error.json().message}]);  
  		}
  	)
  }

   /*
      Event get User in table left
      @author: hoangnguyen 
  */
  getUserLeft(){
  	this.userPermissionService.getUserLeft().subscribe(
  		data =>{
        // reload datatable
        let self = this;
        this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
            self.user_list_left = [];
            self.user_list_left = data;
            dtInstance.clear().draw();
            dtInstance.destroy();
            self.dtTrigger_left.next();
        });
  		},
  		error =>{
         this.router.navigate(['/error', { message: error.json().message}]);
  		}
  	)
  }
  /*
      Event get Role in above table
      @author: hoangnguyen 
  */
  getRoles(){
  	this.userPermissionService.getRoles().subscribe(
  		data =>{
  			this.roles = data;
          if (data.length > 0){
            this.getUserRight(data[0].id);
          }
  		},
  		error =>{
        this.router.navigate(['/error', { message: error.json().message}]);
  		}
  	)
  }
  /*
      Event set Role for user selected
      @author: hoangnguyen 
  */
  setRoleUser( ){
      this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
          var list_id = dtInstance.column(1).data().toArray();
          var role_id = $('.role_checkbox:checked').val();
          this.userPermissionService.setRoleUser( list_id, role_id).subscribe(
            data =>{

            },
            error =>{
              this.router.navigate(['/error', { message: error.json().message}]);
            }
          )
      });
  }
  /*
      Event move all item to right table
      @author: hoangnguyen 
  */
  move_left_all(){
    this.move_is_click = true;
    let selected_temp: any;
      this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
          selected_temp = dtInstance.rows( 'tr' ).data();
          dtInstance.rows('tr').remove().draw();
      });

      this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
           dtInstance.rows.add(selected_temp).draw();
      });
  }

  /*
        Event select All Button on header table
        @author: hoangnguyen 
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
        @author: hoangnguyen 
    */
    selectAllEventRight(event) {
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
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
        Event select checbox on row
            Case1: all row are checked then checkbox all on header is checked
            Case1: any row is not checked then checkbox all on header is not checked
        @author: hoangnguyen 
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
        @author: hoangnguyen 
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
        @author: hoangnguyen
    */
    move_right(): void {
      // uncheck for input select all
        let is_check_all = $('#select-all-left').prop('checked');
        if (is_check_all){
          $('#select-all-left').prop('checked', false);
        }

        this.move_is_click = true;
        let selected_temp: any;
        this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
            selected_temp = dtInstance.rows( '.selected' ).data();
            dtInstance.rows('.selected').remove().draw();          
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
      // uncheck for input select all 
        let is_check_all = $('#select-all-right').prop('checked');
        if (is_check_all){
          $('#select-all-right').prop('checked', false);
        }

        this.move_is_click = true;
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

  ngAfterViewInit(): void {
    this.dtTrigger_right.next();
    this.dtTrigger_left.next();

  }

}
