import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Game } from '../../../shared/class/game';
import { GameService } from '../../../shared/services/game.service';
import { Type } from '../../../shared/class/type';
import { TypeService } from '../../../shared/services/type.service';
import { env } from '../../../../environments/environment';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'form-game',
    templateUrl: './form-game.component.html',
    styleUrls: ['./form-game.component.css'],
    providers: [GameService, TypeService]
})
export class FormGameComponent implements OnInit {

    /*
        author: Lam
    */

    @Input() game: Game; // Get game from component parent

    types: Type[];

    formGame: FormGroup;

    errorMessage: any; // Messages error
    msg_clear_image = '';

    api_domain: string = '';

    constructor(
        private gameService: GameService,
        private typeService: TypeService,
        private fb: FormBuilder,
        private location: Location,
        private router: Router,
        private route: ActivatedRoute
    ) { 
        this.api_domain = env.api_domain_root;
    }

    ngOnInit() {
        this.creatForm();
        this.getTypes();
    }

    /*
        function creatForm(): Create Reactive Form
        author: Lam
    */ 
    creatForm(): void{
        this.formGame = this.fb.group({
            name: [this.game.name, Validators.required],
            image: [this.game.image],
            short_description: [this.game.short_description, Validators.required],
            content: [this.game.content, Validators.required],
            game_type: [this.game.game_type ? this.game.game_type : '', Validators.required],
            is_draft: [this.game.is_draft],
            is_clear_image: [false]
        });
    }

    /*
        function getTypes(): get all type
        @author: Lam
    */ 
    getTypes(): void{
        this.typeService.getTypes().subscribe(
            (data) => {
                this.types = data;
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

    /*
        Function onFileChange(): Input file image to get base 64
        author: Lam
    */ 
    onFileChange(event): void{
        if(event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            this.formGame.get('image').setValue({
                filename: file.name,
                filetype: file.type,
                value: file,
            });
        }
    }


    /*
        Function onSubmit():
         + Step 1: Check game id
         + Step 2:  
            * TH1:  + Id empty then call service function addGame() to add game, 
                    + Later, redirect list game with message
            * TH2:  + Id exist then call service function updateGame() to update Event
                    + Later, redirect list game with message
        author: Lam
    */ 
    onSubmit(): void{
        this.formGame.value.game_type = parseInt(this.formGame.value.game_type);
        let game_form_data = this.convertFormGroupToFormData(this.formGame);
        let value_form = this.formGame.value;
        if(!this.game.id){
            this.gameService.addGame(game_form_data).subscribe(
                (data) => {
                    this.router.navigate(['/game/list', { message_post: value_form.name}]);
                },
                (error) => {
                    { this.errorMessage = error.message; } 
                }
            );
        }else{
            if(value_form.is_clear_image === true && typeof(value_form.image) != 'string'){
                this.formGame.get('is_clear_image').setValue(false);
                this.msg_clear_image = 'Vui lòng gửi một tập tin hoặc để ô chọn trắng, không chọn cả hai.';
            }else{
                this.gameService.updateGame(game_form_data, this.game.id).subscribe(
                    (data) => {
                        this.game = data;
                        this.router.navigate(['/game/list', { message_put: value_form.name}]);
                    },
                    (error) => {
                        { this.errorMessage = error.message; } 
                    }
                );
            }
        }
        
    }

    /*
        Function deleteGameEvent(): confirm delete
        @author: Lam
    */
    deleteGameEvent(){
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
         + Call service function onDelGame() by id to delete event
        Author: Lam
    */
    onDelete(): void {
        const id = this.game.id;
        this.gameService.onDelGame(id).subscribe(
            (data) => {
                this.router.navigate(['/game/list', { message_del: 'success'}]);
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

    /*
        Convert form group to form data to submit form
        @author: lam
    */
    private convertFormGroupToFormData(promotionForm: FormGroup) {
        // Convert FormGroup to FormData
        let promotionValues = promotionForm.value;
        let promotionFormData:FormData = new FormData(); 
        if (promotionValues){
            /* 
                Loop to set value to formData
                Case1: if value is null then set ""
                Case2: If key is image field then set value have both file and name
                Else: Set value default
            */
            Object.keys(promotionValues).forEach(k => { 
                if(promotionValues[k] == null) {
                    promotionFormData.append(k, '');
                } else if (k === 'image') {
                    promotionFormData.append(k, promotionValues[k].value, promotionValues[k].name);
                } else {
                    promotionFormData.append(k, promotionValues[k]);
                }
            });
        }
        return promotionFormData;
    }

}
