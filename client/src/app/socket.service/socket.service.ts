import { Injectable } from "@angular/core";
import { Socket } from "ng-socket-io";
import { IGameModel } from "./../../../../server/app/models/game";

@Injectable()
export class SocketService {

    // private input: String;
    public _player: string = "";
    private _modes: string[];
    private _selectedMode: string;
    private _games: IGameModel[];
    private _showGames: boolean;

    public constructor(
        private _socket: Socket
    ) {
        this._games = [];
        this._modes = ["Single Player", "Two Players"];
        this._selectedMode = "Single Player";
        this._showGames = false;
        this._socket.connect();

        this._socket.on("add_games", (games: IGameModel[]) => {
            this._games = games;
        });

        this._socket.on("connected_to_game", (data: string): void => {
            const { game }: { game: IGameModel } = JSON.parse(data);
            console.log("Users connected to game ", game);
        });

        this._socket.on("created_game", (data: string): void => {
        });
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
        this._socket.emit("get_games");
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
            this._socket.emit("create_game", JSON.stringify({ gameId, value: this.player }));
            this.joinGame(gameId);
        } else {
            console.log("single player");
        }
    }

    public joinGame(gameId: string): void {
        this._socket.emit("connect_to_game", JSON.stringify({ gameId, value: this.player }));

    }

    public get player(): string {
        return this._player;
    }

}
