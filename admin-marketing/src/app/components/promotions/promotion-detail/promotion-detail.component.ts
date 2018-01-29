import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-promotion-detail',
    templateUrl: './promotion-detail.component.html',
    styleUrls: ['./promotion-detail.component.css']
})
export class PromotionDetailComponent implements OnInit {

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
    }

    getPromotionById() {
    	const id = +this.route.snapshot.paramMap.get('id');
    }



}
