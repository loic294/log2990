import { Component, OnInit } from "@angular/core";
import { Difficulty } from "../../../../../common/grid/difficulties";

@Component({
    selector: "app-difficulty",
    templateUrl: "./difficulty.component.html",
    styleUrls: ["./difficulty.component.css"]
})

export class DifficultyComponent implements OnInit {

    public constructor( private _selectedDifficulty: Difficulty ) {
        this._selectedDifficulty = Difficulty.Easy;
    }

    public onSelect(diff: Difficulty): void {
        this._selectedDifficulty = diff;
    }

    public ngOnInit(): void {}

    public get selectedDifficulty(): Difficulty {
        return this._selectedDifficulty;
    }

}
