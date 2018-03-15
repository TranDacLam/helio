import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hot } from '../../../shared/class/hot';
import { HotService } from '../../../shared/services/hot.service';

@Component({
    selector: 'app-edit-hot',
    templateUrl: './edit-hot.component.html',
    styleUrls: ['./edit-hot.component.css'],
    providers: [HotService]
})
export class EditHotComponent implements OnInit {

    hot: Hot;
    lang = 'vi';

    constructor(
        private hotService: HotService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
        this.getHot();
    }

    /*
        Function getHot():
         + Get id from url path
         + Callback service function getHot() by id
        Author: Lam
    */
    getHot(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.hotService.getHot(id, this.lang).subscribe(data => {
            this.hot = data;
        });
    }

}
