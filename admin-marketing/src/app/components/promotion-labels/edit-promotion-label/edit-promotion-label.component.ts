import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PromotionLabel } from '../../../shared/class/promotion-label';
import { PromotionLabelService } from '../../../shared/services/promotion-label.service';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'app-edit-promotion-label',
    templateUrl: './edit-promotion-label.component.html',
    styleUrls: ['./edit-promotion-label.component.css'],
    providers: [PromotionLabelService]
})
export class EditPromotionLabelComponent implements OnInit {

    /*
        author: Lam
    */

    promotion_label: PromotionLabel;

    formPromotionLabel: FormGroup;

    errorMessage = ''; // Messages error

    constructor(
        private promotionLabelService: PromotionLabelService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.getPromotionLabel();
    }

    /*
        Function getFaq():
         + Get id from url path
         + Call service function getPromotionLabel() by id
         + Later, call createForm()
        Author: Lam
    */
    getPromotionLabel(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.promotionLabelService.getPromotionLabel(id).subscribe(
            (data) => {
                console.log(data);
                this.promotion_label = data;
                this.creatForm();
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formPromotionLabel = this.fb.group({
            name: [this.promotion_label.name, Validators.required]
        });
    }

    /*
        Function onSubmit():
         + Call service function updatePromotionLabel use http put
         + Later, success then redirect faq/list with messsage, fail show error
        author: Lam
    */ 
    onSubmit(): void{
        this.promotionLabelService.updatePromotionLabel(this.formPromotionLabel.value, this.promotion_label.id).subscribe(
            (data) => {
                this.router.navigate(['/promotion-label/list', { message_post: this.formPromotionLabel.value.name}]);
            },
            (error) => {
                if(error.code === 400){
                    this.errorMessage = error.message;
                }else{
                    this.router.navigate(['/error', { message: error.message}]);
                }
            }
        );
    }

    /*
        Function deleteNotificationEvent(): confirm delete
        @author: Lam
    */
    deletePromotionLabelEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn",
            message: "Bạn muốn xóa Nhãn Khuyến Mãi này?",
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
        const id = this.promotion_label.id;
        this.promotionLabelService.onDelPromotionLabel(id).subscribe(
            (data) => {
                this.router.navigate(['/promotion-label/list', { message_del: 'success'}]);
            }
        );
    }

}
