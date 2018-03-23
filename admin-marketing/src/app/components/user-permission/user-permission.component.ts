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

    constructor(private userPermissionService: UserPermissionService, private router: Router) { }

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
    reload_left_table: boolean = false;
    check_all_left: boolean = false;
    check_all_right: boolean = false;

    /*
        Event get User in table right
        @author: hoangnguyen 
    */
    getUserRight(id: number) {
        this.userPermissionService.getUserRight(id).subscribe(
            data => {
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
                if (this.reload_left_table) {
                    this.reload_left_table = false;
                    this.getUserLeft();
                }
            },
            error => {
                this.router.navigate(['/error', { message: error.json().message }]);
            }
        )
    }

    /*
       Event get User in table left
       @author: hoangnguyen 
   */
    getUserLeft() {
        this.userPermissionService.getUserLeft().subscribe(
            data => {
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
            error => {
                this.router.navigate(['/error', { message: error.json().message }]);
            }
        )
    }
    /*
        Event get Role in above table
        @author: hoangnguyen 
    */
    getRoles() {
        this.userPermissionService.getRoles().subscribe(
            data => {
                this.roles = data;
                if (data.length > 0) {
                    this.getUserRight(data[0].id);
                }
            },
            error => {
                this.router.navigate(['/error', { message: error.json().message }]);
            }
        )
    }
    /*
        Event set Role for user selected
        @author: hoangnguyen 
    */
    setRoleUser() {
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            var list_id = dtInstance.column(1).data().toArray();
            var role_id = $('.role_checkbox:checked').val();
            this.userPermissionService.setRoleUser(list_id, role_id).subscribe(
                data => {

                },
                error => {
                    this.router.navigate(['/error', { message: error.json().message }]);
                }
            )
        });
    }

    /*
          Event select All item on a page
          @author: hoangnguyen 
      */
    selectAllPageLeft(event) {
        if (event.target.checked) {
            $("#table_id_1 tr").addClass('selected');
        } else {
            $("#table_id_1 tr").removeClass('selected');
        }
        $("#table_id_1 tr input:checkbox").prop('checked', event.target.checked);
    }
    /*
          Event select All item
          @author: hoangnguyen 
      */
    selectAllEventLeft(is_selected: boolean) {
        this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows().every(function() {
                let row = this.node();
                if (is_selected) {
                    $(row).addClass('selected');
                    $(row).find('input:checkbox').prop('checked', true);
                } else {
                    $(row).removeClass('selected');
                    $(row).find('input:checkbox').prop('checked', false);
                }
            });
        });
        this.check_all_left = (is_selected) ? true : false;
    }
    /*
        Event select All item on a page
        @author: hoangnguyen 
    */
    selectAllPageRight(event) {
        if (event.target.checked) {
            $("#table_id_2 tr").addClass('selected');
        } else {
            $("#table_id_2 tr").removeClass('selected');
        }
        $("#table_id_2 tr input:checkbox").prop('checked', event.target.checked);
    }
    /*
        Event select All item
        @author: hoangnguyen 
    */
    selectAllEventRight(is_selected: boolean) {
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows().every(function() {
                let row = this.node();
                if (is_selected) {
                    $(row).addClass('selected');
                    $(row).find('input:checkbox').prop('checked', true);
                } else {
                    $(row).removeClass('selected');
                    $(row).find('input:checkbox').prop('checked', false);
                }
            });
        });
        this.check_all_right = (is_selected) ? true : false;
    }

    /*
        Event select checbox on row
            Case1: all row are checked then checkbox all on header is checked
            Case1: any row is not checked then checkbox all on header is not checked
        @author: hoangnguyen 
    */
    selectCheckboxLeft(event) {
        $(event.target).closest("tr").toggleClass("selected");
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
        $(event.target).closest("tr").toggleClass("selected");
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
        if (is_check_all) {
            $('#select-all-left').prop('checked', false);
        }

        this.reload_left_table = true;
        let selected_temp: any;
        this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
            selected_temp = dtInstance.rows('.selected').data();
            dtInstance.rows('.selected').remove().draw();
        });
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows.add(selected_temp).draw();
        });
        // if table right is checkek then uncheck
        $("#table_id_2 tr input:checkbox").prop('checked', false);
        $("#table_id_2 tr").removeClass('selected');
        $('#select-all-right').prop('checked', false);
    }
    /*
        Move all row is checked to left tatble
        @author: hoangnguyen
    */
    move_left(): void {
        // uncheck for input select all 
        let is_check_all = $('#select-all-right').prop('checked');
        if (is_check_all) {
            $('#select-all-right').prop('checked', false);
        }

        this.reload_left_table = true;
        let selected_temp: any;
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            selected_temp = dtInstance.rows('.selected').data();
            dtInstance.rows('.selected').remove().draw();
        });

        this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows.add(selected_temp).draw();
        });
        // if table left is checkek then uncheck
        $("#table_id_1 tr input:checkbox").prop('checked', false);
        $("#table_id_1 tr").removeClass('selected');
        $('#select-all-left').prop('checked', false);
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
            order: [[1, 'asc']],
            scrollX: true,
            scrollY: "400px",
            language: {
                sSearch: "",
                searchPlaceholder: "Nhập thông tin tìm kiếm",
                lengthMenu: "Hiển thị _MENU_ dòng",
                sZeroRecords: "Không tìm thấy User nào phù hợp",
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
            order: [[1, 'asc']],
            scrollX: true,
            scrollY: "400px",
            language: {
                sSearch: "",
                searchPlaceholder: "Nhập thông tin tìm kiếm",
                lengthMenu: "Hiển thị _MENU_ dòng",
                sZeroRecords: "Không tìm thấy User nào phù hợp",
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
