import { Component, OnInit } from "@angular/core";
import { SocketService } from "../../socket.service/socket.service";
import { IGameModel } from "./../../../../../server/app/models/game";

@Component({
  selector: "app-mode",
  templateUrl: "./mode.component.html",
  styleUrls: ["./mode.component.css"]
})
export class ModeComponent implements OnInit {

    // private input: String;

    public constructor(
        private _socket: SocketService
    ) { }

    public get modes(): string[] {
        return this._socket.modes;
    }

    public get player(): string {
        return this._socket.player;
    }

    public onEnter(value: string): void {
        this._socket.onEnter(value);
    }

    public get selectedMode(): string {
        return this._socket.selectedMode;
    }

    public onSelect(mode: string): void {
        return this._socket.onSelect(mode);
    }

    public get games(): IGameModel[] {
        return this._socket.games;
    }

    public addGames(): void {
        this._socket.addGames();
    }

    public toggleShowGames(): void {
        this._socket.toggleShowGames();
    }

    public get showGames(): boolean {
        return this._socket.showGames;
    }

    public createGame(mode: string): void {
        this._socket.createGame(mode);
    }

    public joinGame(gameId: string): void {
        this._socket.joinGame(gameId);
    }

    public ngOnInit(): void {
    }

}
