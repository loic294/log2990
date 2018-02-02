import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-difficulty",
    templateUrl: "./difficulty.component.html",
    styleUrls: ["./difficulty.component.css"]
})

export class DifficultyComponent implements OnInit {

    private _selectedDifficulty: string;
    private _difficulties: string[];

    public constructor() {
        this._difficulties = ["Easy", "Normal", "Hard"];
    }

    public ngOnInit(): void {
    }

    public get difficulties(): string[] {
        return this._difficulties;
    }

    public get selectedDifficulty(): string {
        return this._selectedDifficulty;
    }

    public onSelect(diff: string): void {
        this._selectedDifficulty = diff;
    }

}
