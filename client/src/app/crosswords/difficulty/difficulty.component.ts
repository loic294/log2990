import { Component, OnInit } from "@angular/core";
import { Difficulty, difficultyName } from "../../../../../common/grid/difficulties";

@Component({
    selector: "app-difficulty",
    templateUrl: "./difficulty.component.html",
    styleUrls: ["./difficulty.component.css"]
})

export class DifficultyComponent implements OnInit {

    private _selectedDifficulty: Difficulty;
    private difficulties: Array<Difficulty>;

    public constructor( ) {
        this._selectedDifficulty;
        this.difficulties = [
            Difficulty.Easy,
            Difficulty.Normal,
            Difficulty.Hard
        ];
    }

    public onSelect(diff: Difficulty): void {
        this._selectedDifficulty = diff;
    }

    public ngOnInit(): void {}

    public get selectedDifficulty(): Difficulty {
        return this._selectedDifficulty;
    }

    public get difficultyName(): Function {
        return difficultyName;
    }

}
