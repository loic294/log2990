import { Component, OnInit } from "@angular/core";

export enum Difficulty {
    Easy = 0,
    Normal = 1,
    Hard = 2
}


@Component({
    selector: "app-difficulty",
    templateUrl: "./difficulty.component.html",
    styleUrls: ["./difficulty.component.css"]
})

export class DifficultyComponent implements OnInit {

    private _selectedDifficulty: string;
    private _difficulties: string[];

    public onSelect(diff: string): void {
        this._selectedDifficulty = diff;
    }

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

}
