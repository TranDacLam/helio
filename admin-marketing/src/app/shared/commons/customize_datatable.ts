import { Injectable } from '@angular/core';

@Injectable()
export class CustomizeDataTable {
    /*
        Function dataTableSorting()
        Customize icon sorting
        @author: Trangle
    */
    dataTableSorting(dataTableID) {
        // var spanSorting = '<span class="arrow-hack">&nbsp;&nbsp;&nbsp;</span>';
        $(dataTableID).each(function(i, th) {
            $(th).find('span').addClass('arrow-hack'); 
        });     
    }
}