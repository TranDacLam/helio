import { Component, OnInit } from '@angular/core';

import { Denomination } from '../../../shared/class/denomination';

import { DenominationService } from '../../../shared/services/denomination.service';
import { Router } from "@angular/router";

@Component({
    selector: 'app-denomination-add',
    templateUrl: './denomination-add.component.html',
    styleUrls: ['./denomination-add.component.css']
})
export class DenominationAddComponent implements OnInit {

    denominations: Denomination[] = [];
    errorMessage: string;
    constructor(
        private router: Router,
        private denominationService: DenominationService,
        ) { }

    ngOnInit() {
    }

    addDenomination(denomination: number) {
        this.denominationService.createDenomination({ denomination } as Denomination )
        .subscribe(
            (denomination) => {
                this.denominations.push(denomination); 
                this.router.navigate(['/denomination-list', { message_post: denomination.denomination} ])   
            },
            error =>  this.errorMessage = <any>error);
    }

}
