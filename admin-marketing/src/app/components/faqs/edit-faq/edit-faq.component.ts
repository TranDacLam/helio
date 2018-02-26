import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Faq } from '../../../shared/class/faq';
import { FaqService } from '../../../shared/services/faq.service';
import 'rxjs/add/observable/throw';

@Component({
    selector: 'app-edit-faq',
    templateUrl: './edit-faq.component.html',
    styleUrls: ['./edit-faq.component.css'],
    providers: [FaqService]
})
export class EditFaqComponent implements OnInit {

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
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.getFaq();
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
        this.faqService.getFaq(id).subscribe(data => {
            this.faq = data;
            this.creatForm();
        });
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
         + Call service function updateFaq use http put
         + Later, success then redirect faq/list with messsage, fail show error
        author: Lam
    */ 
    onSubmit(): void{
        this.faqService.updateFaq(this.formFaq.value, this.faq.id).subscribe(
            (data) => {
                this.router.navigate(['/faq/list', { message_post: this.formFaq.value.name}]);
            },
            (error) => {
                { this.errorMessage = error.message; } 
            }
        );
    }

    /*
        Function onDelete():
         + Get id from url path
         + Call service function onDelFaq() by id to delete faq
        Author: Lam
    */
    onDelete(): void {
        const id = this.faq.id;
        this.faqService.onDelFaq(id).subscribe();
        this.router.navigate(['/faq/list']);
    }

}
