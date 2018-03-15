import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../../../shared/class/game';
import { GameService } from '../../../shared/services/game.service';
import { message } from '../../../shared/utils/message';
import 'rxjs/add/observable/throw';
import * as datatable_config from '../../../shared/commons/datatable_config';

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

    dtOptions: any = {};

    games: Game[];
    games_del = []; // Get array id to delete all id game
    length_games: number;
    select_checked = false; // Check/uncheck all game
    message_result = ''; // Message error
    errorMessage = '';

    lang: string = 'vi';

    constructor(private gameService: GameService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.dtOptions = datatable_config.data_config('Trò Chơi').dtOptions;
        this.getGames();

        /*
            Use route to get params from url
            Author: Lam
        */
        this.route.params.subscribe(params => {
            if(params.message_put){
                this.message_result = `${message.edit} "${params.message_put}" ${message.success}`;
            }else if(params.message_post){
                this.message_result = `${message.create_new} "${params.message_post}" ${message.success}`;
            }else if(params.message_del){
                this.message_result = 'Xóa trò chơi thành công.';
            }
        });
    }

    /*
        Function getGames(): Callback service function getGames() get all Game
        Author: Lam
    */
    getGames(){
        this.gameService.getGames(this.lang).subscribe(
            (data) => {
                this.games = data;
                this.length_games = this.games.length;
            },
            (error) => {
                if(error.code === 403){
                    this.errorMessage = error.message;
                }else{
                    this.router.navigate(['/error', { message: error.message}]);
                }
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
                message: "Bạn muốn xóa " + this.games_del.length + " trò chơi đã chọn",
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
            bootbox.alert("Vui lòng chọn trò chơi cần xóa");
        }
        
    }

    /*
        Function onDelelteGame(): 
         + Callback service function onDelelteGame() delete game by array id
         + Remove tr have del-{{id}} and draw tables
        Author: Lam
    */
    onDelelteGame(){
        this.gameService.onDelGameSelect(this.games_del, this.lang).subscribe(
            (data) => {
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                    this.games_del.forEach(function(element) {
                        dtInstance.rows('#del-'+element).remove().draw();
                    });
                    this.message_result = 'Xóa '+ this.games_del.length +' trò chơi thành công.';
                    this.length_games = this.length_games - this.games_del.length;
                    this.games_del = [];
                });
                this.select_checked = false;
                this.errorMessage = '';
            }
        );
    }

     /*
        Function changeLangVI(): Change language and callback service getEvents()
        Author: Lam
    */
    changeLangVI(){
        if(this.lang === 'en'){
            $('.custom_table').attr('style', 'height: 640px');
            this.games = null;
            this.lang = 'vi';
            this.getGames();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }

    /*
        Function changeLangEN(): Change language and callback service getEvents()
        Author: Lam
    */
    changeLangEN(){
        if(this.lang === 'vi'){
            $('.custom_table').attr('style', 'height: 640px');
            this.games = null;
            this.lang = 'en';
            this.getGames();
            setTimeout(()=>{
                $('.custom_table').attr('style', 'height: auto');
            },100);
        }
    }

}
