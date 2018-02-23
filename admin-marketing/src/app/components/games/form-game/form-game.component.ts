import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Game } from '../../../shared/class/game';
import { GameService } from '../../../shared/services/game.service';
import 'rxjs/add/observable/throw';

@Component({
    selector: 'form-game',
    templateUrl: './form-game.component.html',
    styleUrls: ['./form-game.component.css'],
    providers: [GameService]
})
export class FormGameComponent implements OnInit {

    /*
        author: Lam
    */

    // set inputImage property as a local variable, #inputImage on the tag input file
    @ViewChild('inputImage')
    inputImage: any;

    @Input() game: Game; // Get game from component parent

    formGame: FormGroup;

    errorMessage = ''; // Messages error

    constructor(
        private gameService: GameService,
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
        this.formGame = this.fb.group({
            name: [this.game.name, Validators.required],
            image: [this.game.image, Validators.required],
            short_description: [this.game.short_description, Validators.required],
            content: [this.game.content, Validators.required],
            game_type_id: [this.game.game_type_id, Validators.required],
            is_draft: [this.game.is_draft],
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
                this.formGame.get('image').setValue(reader.result.split(',')[1]);
            };
        }
    }

    /*
        Function clearFile(): Clear value input file image
        author: Lam
    */ 
    clearFile(): void {
        this.formGame.get('image').setValue(null);
        this.inputImage.nativeElement.value = "";
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
        if(!this.game.id){
            this.gameService.addGame(this.formGame.value).subscribe(
                (data) => {
                    this.router.navigate(['/game/list', { message_post: this.formGame.value.name}]);
                },
                (error) => {
                    { this.errorMessage = error.message; } 
                }
            );
        }else{
            this.gameService.updateGame(this.formGame.value, this.game.id).subscribe(
                (data) => {
                    this.game = data;
                    this.router.navigate(['/game/list', { message_put: this.formGame.value.name}]);
                },
                (error) => {
                    { this.errorMessage = error.message; } 
                }
            );
        }
        
    }

}
