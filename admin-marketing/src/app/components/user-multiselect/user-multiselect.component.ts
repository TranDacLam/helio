import { Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { User } from '../../shared/class/user';


@Component({
    selector: 'app-user-multiselect',
    templateUrl: './user-multiselect.component.html',
    styleUrls: ['./user-multiselect.component.css']
})
/*
    UserMultiselectComponent
    @author: diemnguyen
*/
export class UserMultiselectComponent implements OnInit {

    @ViewChildren(DataTableDirective)
    dtElements: QueryList<DataTableDirective>;

    dtOptions_left: any = {};
    dtOptions_right: any = {};

    @Input('user_list_left') 
    user_list_left: User[];

    @Input('user_list_right') 
    user_list_right: User[] = [];

    @Output()
    save: EventEmitter<number[]> = new EventEmitter<number[]>();

    is_button_left: boolean = false;
    is_button_rigth: boolean = false;

    constructor() { }

    ngOnInit() {
        this.dtOptions_left = {
            pagingType: "full_numbers",
            columnDefs: [{
                orderable: false,
                className: "dt-center",
                targets: 0
            }], 
            order: [[ 1, 'asc' ]],
            scrollX: true,
            scrollY: "400px",
            scrollCollapse: true,
            language: {
                sSearch: "",
                searchPlaceholder: "Nhập thông tin tìm kiếm",
                lengthMenu: "Hiển thị _MENU_ dòng",
                sZeroRecords:  " ",
                info: "Hiển thị _START_ đến _END_ của _TOTAL_",
                infoEmpty: "Hiển thị 0 đến 0 của 0",
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
            drawCallback: (setting) => {
                this.checkSelectAllCheckboxLeft();
            }
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
            scrollY: "400px",
            scrollCollapse: true,
            language: {
                sSearch: "",
                searchPlaceholder: "Nhập thông tin tìm kiếm",
                lengthMenu: "Hiển thị _MENU_ dòng",
                sZeroRecords:  " ",
                info: "Hiển thị _START_ đến _END_ của _TOTAL_",
                infoEmpty: "Hiển thị 0 đến 0 của 0",
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
            },
            drawCallback: (setting) => {
                this.checkSelectAllCheckboxRight();
            }
        }
    }

    /*
        Event select All Button on header table
        @author: diemnguyen 
    */
    selectAllEventLeft(event) {
        this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows().every( function () {
                let row = this.node();
                $(row).addClass('selected');
                $(row).find('input:checkbox').prop('checked', true);
            });
            this.is_button_left = true;
        });
    }

    cancelSelectAllEventLeft(event){
        this.dtElements.first.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows().every( function () {
                let row = this.node();
                $(row).removeClass('selected');
                $(row).find('input:checkbox').prop('checked', false);
            });
            this.is_button_left = false;
        });
    }

    /*
        Event select All Button on header table
        @author: diemnguyen 
    */
    selectAllEventRight(event) {
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows().every( function () {
                let row = this.node();
                $(row).addClass('selected');
                $(row).find('input:checkbox').prop('checked', true);
            });
            this.is_button_rigth = true;
        });
    }

    cancelSelectAllEventRight(event){
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.rows().every( function () {
                let row = this.node();
                $(row).removeClass('selected');
                $(row).find('input:checkbox').prop('checked', false);
            });
            this.is_button_rigth = false;
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
        });

        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
             dtInstance.rows.add(selected_temp).draw();
        });
        $("#table_id_2 tr input:checkbox").prop('checked', false);
        this.is_button_left = false;
        this.is_button_rigth = false;

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
        $("#table_id_1 tr input:checkbox").prop('checked', false);
        this.is_button_left = false;
        this.is_button_rigth = false;
    }

    /*
        Event select All Button on header table
        @author: Lam 
    */
    selectAllPageLeft(event) {
        if( event.target.checked ) {
            $("#table_id_1 tr").addClass('selected');
        } else {
            $("#table_id_1 tr").removeClass('selected');
        }
        $("#table_id_1 tr input:checkbox").prop('checked', event.target.checked);
    }

    /*
        Event select All Button on header table
        @author: Lam 
    */
    selectAllPageRight(event) {
        if( event.target.checked ) {
            $("#table_id_2 tr").addClass('selected');
        } else {
            $("#table_id_2 tr").removeClass('selected');
        }
        $("#table_id_2 tr input:checkbox").prop('checked', event.target.checked);
    }

    // input checkall checked/unchecked
    checkSelectAllCheckboxLeft() {
        $('#select-all-left').prop('checked', $("#table_id_1 tbody tr:not(.selected)").length === 0);
    }

    // input checkall checked/unchecked
    checkSelectAllCheckboxRight() {
        if(this.user_list_right){
            $('#select-all-right').prop('checked', $("#table_id_2 tbody tr:not(.selected)").length === 0);
        }
    }


    /*
        @author: diemnguyen
    */
    onSave(): void {
        $('#select-all-left').prop('checked', false);
        $('#select-all-right').prop('checked', false);
        this.is_button_left = false;
        this.is_button_rigth = false;
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            this.save.emit(dtInstance.column(1).data().toArray());
        });
    }

}
