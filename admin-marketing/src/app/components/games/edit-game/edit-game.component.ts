import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../../../shared/class/game';
import { GameService } from '../../../shared/services/game.service';

@Component({
    selector: 'app-edit-game',
    templateUrl: './edit-game.component.html',
    styleUrls: ['./edit-game.component.css'],
    providers: [GameService]
})
export class EditGameComponent implements OnInit {

    game: Game;

    lang = 'vi';

    constructor(
        private gameService: GameService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if(params.lang){
                this.lang = params.lang;
            }
        });
        this.getGame();
    }

    /*
        Function getGame():
         + Get id from url path
         + Callback service function getGame() by id
        Author: Lam
    */
    getGame(){
        const id = +this.route.snapshot.paramMap.get('id');
        this.gameService.getGame(id, this.lang).subscribe(
            (data) => {
                this.game = data;
            },
            (error) => {
                this.router.navigate(['/error', { message: error.message}]);
            }
        );
    }

}
