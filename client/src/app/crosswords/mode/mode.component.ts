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
        private socketService: SocketService
    ) { }

    public get modes(): string[] {
        return this.socketService.modes;
    }

    public get player(): string {
        return this.socketService.player;
    }

    public onEnter(value: string): void {
        this.socketService.onEnter(value);
    }

    public get selectedMode(): string {
        return this.socketService.selectedMode;
    }

    public onSelect(mode: string): void {
        return this.socketService.onSelect(mode);
    }

    public get games(): IGameModel[] {
        return this.socketService.games;
    }

    public addGames(): void {
        this.socketService.addGames();
    }

    public toggleShowGames(): void {
        this.socketService.toggleShowGames();
    }

    public get showGames(): boolean {
        return this.socketService.showGames;
    }

    public createGame(mode: string): void {
        this.socketService.createGame(mode);
    }

    public joinGame(gameId: string): void {
        this.socketService.joinGame(gameId);
    }

    public ngOnInit(): void {
    }

}
