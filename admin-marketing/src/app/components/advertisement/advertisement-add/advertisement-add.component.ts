import { Component, OnInit } from '@angular/core';
import { Advertisement } from '../../../shared/class/advertisement';

@Component({
  selector: 'app-advertisement-add',
  templateUrl: './advertisement-add.component.html',
  styleUrls: ['./advertisement-add.component.css']
})
export class AdvertisementAddComponent implements OnInit {

    adv: Advertisement = new Advertisement(); // create object advertiment
    method = 'POST';
    title = 'Thêm Quảng Cáo';

   	constructor(
   	){ }

   	ngOnInit() {    
   	}
}
