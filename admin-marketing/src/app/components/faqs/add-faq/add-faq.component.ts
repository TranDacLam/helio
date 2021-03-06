import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Faq } from '../../../shared/class/faq';
import { FaqService } from '../../../shared/services/faq.service';
import { Category } from './../../../shared/class/category';
import { CategoryService } from './../../../shared/services/category.service';
import 'rxjs/add/observable/throw';

@Component({
    selector: 'app-add-faq',
    templateUrl: './add-faq.component.html',
    styleUrls: ['./add-faq.component.css'],
    providers: [FaqService, CategoryService]
})
export class AddFaqComponent implements OnInit {

    /*
        author: Lam
    */

    faq: Faq = new Faq();
    categories: Category[];

    formFaq: FormGroup;

    errorMessage: any; // Messages error

    constructor(
        private faqService: FaqService,
        private fb: FormBuilder,
        private router: Router,
        private categoryService: CategoryService
    ) { }

    ngOnInit() {
        this.creatForm();
        this.getCategories();
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formFaq = this.fb.group({
            question: [this.faq.question, Validators.required],
            answer: [this.faq.answer, Validators.required],
            category: ['', Validators.required],
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
         + Call service function addFaq use http post
         + Later, success then redirect faq/list with messsage, fail show error
        author: Lam
    */ 
    onSubmit(): void{
        this.formFaq.value.category = parseInt(this.formFaq.value.category);
        this.faqService.addFaq(this.formFaq.value).subscribe(
            (data) => {
                this.router.navigate(['/faq/list', { message_post: this.formFaq.value.question}]);
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
