import { Injectable } from "@angular/core";
import { Socket } from "ng-socket-io";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { IGameModel } from "./../../../../server/app/models/game";
import { difficultyName } from "../../../../common/grid/difficulties";
import { DifficultyService } from "./../difficulty.service/difficulty.service";

@Injectable()
export class SocketService {

    // private input: String;
    public _player: string = "";
    private _difficulty: String;
    private _modes: string[];
    private _selectedMode: string;
    private _games: IGameModel[];
    private _showGames: boolean;

    private _updateUserConnected: Observable<boolean>;
    private _userConnected: Subject<boolean> = new Subject<boolean>();

    private _updateHighligthCell: Observable<string>;
    private _highlightCell: Subject<string> = new Subject<string>();

    public constructor(
        private _socket: Socket,
        private difficultyService: DifficultyService
    ) {
        this.difficultyService.difficulty.subscribe((diff)=>{
            this._difficulty = difficultyName(diff);
        });

        this._games = [];
        this._modes = ["Single Player", "Two Players"];
        this._selectedMode = "";
        this._showGames = false;
        this._updateUserConnected = this._userConnected.asObservable();
        this._socket.connect();

        this._updateHighligthCell = this._highlightCell.asObservable();

        this._socket.on("add_games", (games: IGameModel[]) => {
            this._games = games;
        });

        this._socket.on("connected_to_game", (data: string): void => {
            // const { game }: { game: IGameModel } = JSON.parse(data);
        });

        this._socket.on("created_game", (data: string): void => {
        });

        this._socket.on("highligth_cell_in_color", (data: string): void => {
            this._highlightCell.next(data);
        });

        this._socket.on("second_player_joined", (data: any) => {
            this._userConnected.next(true);
            console.log("player connected --------");
        })
    }

    public get isUserConnected(): Observable<boolean>{
        return this._updateUserConnected;
    }

    public get cellToHighligh(): Observable<string> {
        return this._updateHighligthCell;
    }

    public onEnter(value: string): void {
        this._player = value;
    }

    public get modes(): string[] {
        return this._modes;
    }
    public get selectedMode(): string {
        return this._selectedMode;
    }

    public onSelect(mode: string): void {
        this._selectedMode = mode;
    }

    public get games(): IGameModel[] {
        return this._games;
    }

    public addGames(): void {
        this._socket.emit("get_games", this.difficulty);
    }

    public toggleShowGames(): void {
        this._showGames = !this._showGames;
    }

    public get showGames(): boolean {
        return this._showGames;
    }

    public createGame(mode: string): void {
        if (mode === "Two Players") {
            const gameId: string = this.player;
            const difficulty: String = this.difficulty;
            this._socket.emit("create_game", JSON.stringify({ gameId, difficulty}));
            this.joinGame(gameId);
        }
    }

    public joinGame(gameId: string): void {
        this._socket.emit("connect_to_game", JSON.stringify({ gameId, value: this.player }));
    }

    public get player(): string {
        return this._player;
    }
    public get difficulty(): String {
        return this._difficulty;
    }

    public highligthCell(row: number, col: number): void {
        this._socket.emit("highligth_cell", JSON.stringify({ row, col}));
    }

}
