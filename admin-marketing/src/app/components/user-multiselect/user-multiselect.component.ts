import { Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { User } from '../../shared/class/user';
import { datatable_config } from '../../shared/commons/datatable_config';


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
                $('td', row).find('input:checkbox').bind('change', event => {
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
                $('td', row).find('input:checkbox').bind('change', () => {
                    this.selectCheckboxRight(event);
                });
                return row;
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

    /*
        @author: diemnguyen
    */
    onSave(): void {
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            this.save.emit(dtInstance.column(1).data().toArray());
        });
    }

}
