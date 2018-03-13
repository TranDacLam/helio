import { Component, OnInit } from '@angular/core';
import { Hot } from '../../../shared/class/hot';

@Component({
  selector: 'app-add-hot',
  templateUrl: './add-hot.component.html',
  styleUrls: ['./add-hot.component.css']
})
export class AddHotComponent implements OnInit {

    hot: Hot = new Hot(); // create object event

    constructor() { }

    ngOnInit() {
    }

}
