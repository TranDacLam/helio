import { Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

import { User } from '../../shared/class/user';


@Component({
    selector: 'app-user-multiselect',
    templateUrl: './user-multiselect.component.html',
    styleUrls: ['./user-multiselect.component.css']
})
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
        this.dtOptions_left = this.dtOptions_right = {
            columnDefs: [ {
                orderable: false,
                className: 'select-checkbox',
                targets: 0
            },{
                "visible": false, "targets": 1
            } ],
            select: {
                style: 'multi',
                selector: 'td:first-child'
            },
            dom: 'lfBrtip',
            buttons: [
                'selectAll',
                'selectNone',
            ],
            order: [[ 1, 'asc' ]]
        };
    }

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


    onSave(): void {
        this.dtElements.last.dtInstance.then((dtInstance: DataTables.Api) => {
            this.save.emit(dtInstance.column(1).data().toArray());
        });
    }

}
