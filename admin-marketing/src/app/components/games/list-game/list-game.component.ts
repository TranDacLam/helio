import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../../../shared/class/game';
import { GameService } from '../../../shared/services/game.service';
import { message } from '../../../shared/utils/message';
import 'rxjs/add/observable/throw';

declare var bootbox:any;

@Component({
    selector: 'app-list-game',
    templateUrl: './list-game.component.html',
    styleUrls: ['./list-game.component.css'],
    providers: [GameService]
})
export class ListGameComponent implements OnInit {

    /*
        Author: Lam
    */

    // Inject the DataTableDirective into the dtElement property
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;

    games: Game[];
    games_del = []; // Get array id to delete all id game
    select_checked = false; // Check/uncheck all game
    message_result = ''; // Message error

    constructor(private gameService: GameService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.getGames();

        /*
            Use route to get params from url
            Author: Lam
        */
        this.route.params.subscribe(params => {
            if(params.message_put){
                this.message_result = `${message.edit} ${params.message_put} ${message.success}`;
            }else if(params.message_post){
                this.message_result = `${message.create_new} ${params.message_post} ${message.success}`;
            }
        });
    }

    /*
        Function getGames(): Callback service function getGames() get all Game
        Author: Lam
    */
    getGames(){
        this.gameService.getGames().subscribe(
            (data) => {
                this.games = data;
            } 
        );
    }

    /*
        Function onSelectCKB(): checked/uncheck add/delete id to array games_del
        Author: Lam
    */
    onSelectCKB(event, game){
        if(event.target.checked){
            this.games_del.push(game.id);
        }else{
            this.games_del = this.games_del.filter(k => k !== game.id);
        }
    }

    /*
        Function onSelectAll(): checked/uncheck add/delete all id game to array games_del
        Author: Lam
    */
    onSelectAll(event){
        this.games_del = [];
        let array_del = [];
        if(event.target.checked){
            this.games.forEach(function(element) {
                array_del.push(element.id);
            });
            this.games_del = array_del;
            this.select_checked = true;
        }else{
            this.select_checked = false;
        }
    }

    /*
        Function deleteGameEvent(): confirm delete
        @author: Lam
    */
    deleteGameEvent(){
        let that = this;
        if ( this.games_del.length > 0 ) {
            bootbox.confirm({
                title: "Bạn có chắc chắn",
                message: "Bạn muốn xóa " + this.games_del.length + " phần tử đã chọn",
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
                        that.onDelelteGame();
                    }
                }
            });

        } else  {
            bootbox.alert("Vui lòng chọn phần tử cần xóa");
        }
        
    }

    /*
        Function onDelelteGame(): 
         + Callback service function onDelelteGame() delete game by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDelelteGame(){
        this.gameService.onDelGameSelect(this.games_del).subscribe(
            (data) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    this.games_del.forEach(function(element) {
                        dtInstance.rows('#del-'+element).remove().draw();
                    });
                });
            }
        );
    }

}
