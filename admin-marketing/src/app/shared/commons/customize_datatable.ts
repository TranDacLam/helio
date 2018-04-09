import { Injectable } from '@angular/core';

@Injectable()
export class CustomizeDataTable {
    /*
        Function dataTableSorting()
        Customize icon sorting
        @author: Trangle
    */
    dataTableSorting() {
        var spanSorting = '<span class="arrow-hack">&nbsp;&nbsp;&nbsp;</span>';
        $("#table_id thead th").not(':first').each(function(i, th) {
            $(th).find('.arrow-hack').remove();
            $(th).append(spanSorting); 
        });     
    }
}