import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-mode",
  templateUrl: "./mode.component.html",
  styleUrls: ["./mode.component.css"]
})
export class ModeComponent implements OnInit {

    private _selectedMode: string;
    private _modes: string[];

    public constructor() {
        this._modes = ["Single Player", "Two Players"];
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

    public ngOnInit(): void {
    }

}
