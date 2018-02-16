import { Component, OnInit, Optional } from "@angular/core";
import { Socket } from "ng-socket-io";


@Component({
  selector: "app-mode",
  templateUrl: "./mode.component.html",
  styleUrls: ["./mode.component.css"]
})
export class ModeComponent implements OnInit {

    public constructor(
        @Optional() private _modes: string [],
        @Optional() private _selectedMode: string,
        private _socket: Socket,
        ) {

        this._modes = ["Single Player", "Two Players"];
        this._selectedMode = "Single Player";
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

    public createGame(mode: string): void {

        if (mode === "Two Players") {
            const gameId: string = `test`;
           // this._games.push(gameId);
            this.joinGame(gameId);
        } else {
            console.log("single player");
        }
    }

    public joinGame(gameId: string): void {
        this._socket.connect();
        this._socket.emit("connect_to_game", gameId);
        this._socket.on("connected_to_game", (users: number): void => {
            console.log("Users connected to game ", gameId, ": ", users);
        });

    }
    public ngOnInit(): void {
    }

}
