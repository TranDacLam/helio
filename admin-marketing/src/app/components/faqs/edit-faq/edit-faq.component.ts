import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Faq } from '../../../shared/class/faq';
import { FaqService } from '../../../shared/services/faq.service';
import { Category } from './../../../shared/class/category';
import { CategoryService } from './../../../shared/services/category.service';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'app-edit-faq',
    templateUrl: './edit-faq.component.html',
    styleUrls: ['./edit-faq.component.css'],
    providers: [FaqService, CategoryService]
})
export class EditFaqComponent implements OnInit {

    /*
        author: Lam
    */

    faq: Faq;
    categories: Category[];

    formFaq: FormGroup;

    errorMessage: any; // Messages error

    constructor(
        private faqService: FaqService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private categoryService: CategoryService
    ) { }

    ngOnInit() {
        this.getFaq();
        this.getCategories();
    }

    /*
        Function getFaq():
         + Get id from url path
         + Call service function getFaq() by id
         + Later, call createForm()
        Author: Lam
    */
    getFaq(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.faqService.getFaq(id).subscribe(
            (data) => {
                this.faq = data;
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
        this.formFaq = this.fb.group({
            question: [this.faq.question, Validators.required],
            answer: [this.faq.answer, Validators.required],
            category: [this.faq.category ? this.faq.category : '', Validators.required],
        });
    }

    /*
        function getCategories(): get all category
        @author: Lam
    */ 
    getCategories(): void{
        this.categoryService.getAllCategory().subscribe(
            (data) => {
                this.categories = data;
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

    /*
        Function onSubmit():
         + Call service function updateFaq use http put
         + Later, success then redirect faq/list with messsage, fail show error
        author: Lam
    */ 
    onSubmit(): void{
        if(this.formFaq.invalid){
            ValidateSubmit.validateAllFormFields(this.formFaq);
        }else{
            this.formFaq.value.category = parseInt(this.formFaq.value.category);
            this.faqService.updateFaq(this.formFaq.value, this.faq.id).subscribe(
                (data) => {
                    this.router.navigate(['/faq/list', { message_put: this.formFaq.value.question}]);
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
    }

    /*
        Function deleteFaqEvent(): confirm delete
        @author: Lam
    */
    deleteFaqEvent(){
        let that = this;
        bootbox.confirm({
            title: "Bạn có chắc chắn",
            message: "Bạn muốn xóa sự kiện này?",
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
         + Call service function onDelFaq() by id to delete faq
        Author: Lam
    */
    onDelete(): void {
        const id = this.faq.id;
        this.faqService.onDelFaq(id).subscribe(
            (data) => {
                this.router.navigate(['/faq/list', { message_del: 'success'}]);
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

}
