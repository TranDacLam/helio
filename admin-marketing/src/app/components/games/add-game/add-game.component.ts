import { Component, OnInit } from '@angular/core';
import { Game } from '../../../shared/class/game'

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.css']
})
export class AddGameComponent implements OnInit {

    game: Game = new Game(); // create object game

    constructor() { }

    ngOnInit() {
    }

}
