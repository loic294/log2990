import { Component, OnInit, Optional } from "@angular/core";
import { Socket } from "ng-socket-io";
import { IGameModel } from "./../../../../../server/app/models/game";

@Component({
  selector: "app-mode",
  templateUrl: "./mode.component.html",
  styleUrls: ["./mode.component.css"]
})
export class ModeComponent implements OnInit {

    // private input: String;
    
    public constructor(
        @Optional() private _modes: string [],
        @Optional() private _selectedMode: string,
        private _socket: Socket,
        @Optional() private _games: String [],
        @Optional() private _showGames: boolean
        ) {
        this._games = [];
        this._modes = ["Single Player", "Two Players"];
        this._selectedMode = "Single Player";
        this._showGames = false;

    }

    public value: string = "";

    public onEnter(value: string): void {
            this.value = value;
            console.log(this.value);
    }

    public get modes(): string [] {
        return this._modes;
    }
    public get selectedMode(): string {
        return this._selectedMode;
    }

    public onSelect(mode: string): void {
        this._selectedMode = mode;
    }

    public get games(): String[] {
        return this._games;
    }

    public addGames(): void {
        this._socket.emit("get_games");
        this._socket.on("add_games", (games: IGameModel[]) => {
            for (const game of games) {
                if (this.games[games.indexOf(game)] !== game.name && game.players.length === 1 ) {
                this._games.push(game.name);
                }
            }
        });
    }
    public toggleShowGames(): void {
        this._showGames = !this._showGames;
    }
    public get showGames(): boolean {
        return this._showGames;
    }

    public createGame(mode: string): void {
        if (mode === "Two Players") {
            const gameId: string = `game${Math.random().toString(36).substr(2, 9)}`;
            this._socket.emit("create_game", gameId, this.value);
            this._socket.on("created_game", (game: IGameModel): void => {
            });
            this.joinGame(gameId);
        } else {
            console.log("single player");
        }
    }

    public joinGame(gameId: string): void {
        this._socket.connect();
        this._socket.emit("connect_to_game", gameId, this.value);
        this._socket.on("connected_to_game", (users: number): void => {
            console.log("Users connected to game ", gameId, ": ", users);
        });

    }
    public ngOnInit(): void {
    }

}
