import { Component, OnInit, Optional } from "@angular/core";
import { Socket } from "ng-socket-io";

@Component({
  selector: "app-mode",
  templateUrl: "./mode.component.html",
  styleUrls: ["./mode.component.css"]
})
export class ModeComponent implements OnInit {

    public constructor(@Optional() private _modes: string [], @Optional() private _selectedMode: string, private _socket: Socket) {
        this._modes = ["Single Player", "Two Players"];
        this._selectedMode = "Single Player";
        this._socket.connect();
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
            this._socket.emit("create_game", "Game1");
        } else {
            console.log("Single player");
        }
    }

    public ngOnInit(): void {
    }

}
