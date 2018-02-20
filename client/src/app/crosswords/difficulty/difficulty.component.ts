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

    private _selectedDifficulty: Difficulty = Difficulty.Easy;

    public constructor() { }

    public onSelect(diff: Difficulty): void {
        this._selectedDifficulty = diff;
    }

    public ngOnInit(): void {
    }

    public get selectedDifficulty(): Difficulty {
        return this._selectedDifficulty;
    }

}
