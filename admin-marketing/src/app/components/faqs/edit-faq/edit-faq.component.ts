import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Faq } from '../../../shared/class/faq';
import { FaqService } from '../../../shared/services/faq.service';
import { Category } from './../../../shared/class/category';
import { CategoryService } from './../../../shared/services/category.service';
import { ValidateSubmit } from './../../../shared/validators/validate-submit';
import 'rxjs/add/observable/throw';
import { ToastrService } from 'ngx-toastr';
import * as ckeditor_config from './../../../shared/commons/ckeditor_config';

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

    lang = 'vi';
    ckEditorConfig:any;

    constructor(
        private faqService: FaqService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private categoryService: CategoryService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        // get params url
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
        this.getFaq();
        this.getCategories();
        this.ckEditorConfig = ckeditor_config.config;
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
        this.faqService.getFaq(id, this.lang).subscribe(
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
            question: [this.faq.question, [Validators.required, Validators.maxLength(255)]],
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
            this.faqService.updateFaq(this.formFaq.value, this.faq.id, this.lang).subscribe(
                (data) => {
                    this.toastr.success(`Chỉnh sửa "${this.formFaq.value.question}" thành công`);
                    this.router.navigate(['/faq/list']);
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
            title: "Bạn có chắc chắn ?",
            message: "Bạn muốn xóa Câu Hỏi Thường Gặp này",
            buttons: {
                cancel: {
                    label: "HỦY"
                },
                confirm: {
                    label: "XÓA"
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
        this.faqService.onDelFaq(id, this.lang).subscribe(
            (data) => {
                this.toastr.success(`Xóa "${this.formFaq.value.question}" thành công`);
                this.router.navigate(['/faq/list']);
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

}
