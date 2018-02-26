import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Faq } from '../../../shared/class/faq';
import { FaqService } from '../../../shared/services/faq.service';
import 'rxjs/add/observable/throw';

@Component({
    selector: 'app-add-faq',
    templateUrl: './add-faq.component.html',
    styleUrls: ['./add-faq.component.css'],
    providers: [FaqService]
})
export class AddFaqComponent implements OnInit {

    /*
        author: Lam
    */

    faq: Faq = new Faq();

    formFaq: FormGroup;

    errorMessage = ''; // Messages error

    constructor(
        private faqService: FaqService,
        private fb: FormBuilder,
        private router: Router,
    ) { }

    ngOnInit() {
        this.creatForm();
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formFaq = this.fb.group({
            question: [this.faq.question, Validators.required],
            answer: [this.faq.answer, Validators.required],
            category_id: [this.faq.category_id, Validators.required],
        });
    }

    /*
        Function onSubmit():
         + Call service function addFaq use http post
         + Later, success then redirect faq/list with messsage, fail show error
        author: Lam
    */ 
    onSubmit(): void{
        this.faqService.addFaq(this.formFaq.value).subscribe(
            (data) => {
                this.router.navigate(['/faq/list', { message_post: this.formFaq.value.name}]);
            },
            (error) => {
                { this.errorMessage = error.message; } 
            }
        );
    }
}
