import { Component } from "@angular/core";
import { Difficulty, difficultyName } from "../../../../../common/grid/difficulties";
import { DifficultyService } from "./../difficulty.service/difficulty.service";

@Component({
    selector: "app-difficulty",
    templateUrl: "./difficulty.component.html",
    styleUrls: ["./difficulty.component.css"]
})

export class DifficultyComponent {

    private _selectedDifficulty: Difficulty;
    private difficulties: Array<Difficulty>;

    public constructor( private difficultyService: DifficultyService  ) {
        this._selectedDifficulty = null;
        this.difficulties = [
            Difficulty.Easy,
            Difficulty.Normal,
            Difficulty.Hard
        ];
    }

    public onSelect(difficuty: Difficulty): void {
        this._selectedDifficulty = difficuty;
        this.difficultyService.selectDifficulty(difficuty);
    }

    public get selectedDifficulty(): Difficulty {
        return this._selectedDifficulty;
    }

    public get difficultyName(): Function {
        return difficultyName;
    }

}
