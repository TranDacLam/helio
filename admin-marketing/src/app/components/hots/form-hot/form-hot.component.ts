import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Hot } from '../../../shared/class/hot';
import { HotService } from '../../../shared/services/hot.service';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'form-hot',
    templateUrl: './form-hot.component.html',
    styleUrls: ['./form-hot.component.css'],
    providers: [HotService]
})
export class FormHotComponent implements OnInit {

    /*
        author: Lam
    */

    // set inputImage property as a local variable, #inputImage on the tag input file
    @ViewChild('inputImage')
    inputImage: any;

    @Input() hot: Hot; // Get hot from component parent

    formHot: FormGroup;

    errorMessage = ''; // Messages error

    constructor(
        private hotService: HotService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.creatForm();
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formHot = this.fb.group({
            name: [this.hot.name, Validators.required],
            image: [this.hot.image, Validators.required],
            sub_url: [this.hot.sub_url, Validators.required],
            is_show: [this.hot.is_show],
        });
    }

    /*
        Function onFileChange(): Input file image to get base 64
        author: Lam
    */ 
    onFileChange(event): void{
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.formHot.get('image').setValue(reader.result.split(',')[1]);
            };
        }
    }

    /*
        Function clearFile(): Clear value input file image
        author: Lam
    */ 
    clearFile(): void {
        this.formHot.get('image').setValue(null);
        this.inputImage.nativeElement.value = "";
    }

    /*
        Function onSubmit():
         + Step 1: Check hot id
         + Step 2:  
            * TH1:  + Id empty then call service function addHot() to add hot, 
                    + Later, redirect list hot with message
            * TH2:  + Id exist then call service function updateHot() to update hot
                    + Later, redirect list hot with message
        author: Lam
    */
    onSubmit(): void{
        if(!this.hot.id){
            this.hotService.addHot(this.formHot.value).subscribe(
                (data) => {
                    this.router.navigate(['/hot/list', { message_post: this.formHot.value.name}]);
                },
                (error) => {
                    { this.errorMessage = error.message; } 
                }
            );
        }else{
            this.hotService.updateHot(this.formHot.value, this.hot.id).subscribe(
                (data) => {
                    this.hot = data;
                    this.router.navigate(['/hot/list', { message_put: this.formHot.value.name}]);
                },
                (error) => {
                    { this.errorMessage = error.message; } 
                }
            );
        }
        
    }

    /*
        Function deleteNotificationEvent(): confirm delete
        @author: Lam
    */
    deleteHotEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn",
            message: "Bạn muốn xóa Hot này?",
            buttons: {
                cancel: {
                    label: "Hủy"
                },
                confirm: {
                    label: "Xóa"
                }
            },
            callback: function (result) {
                if(result) {
                    that.onDelete();
                }
            }
        });
    }

    /*
        Function onDelete():
         + Get id from url path
         + Callback service function onDelNoti() by id to delete notification
        Author: Lam
    */
    onDelete(): void {
        const id = this.hot.id;
        this.hotService.onDelHot(id).subscribe(
            (data) => {
                this.router.navigate(['/hot/list', { message_del: 'success'}]);
            }
        );
    }

}
