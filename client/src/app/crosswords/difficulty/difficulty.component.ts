import { Component, OnInit } from "@angular/core";
<<<<<<< 10b8482b07a4e3f861d998db93acc32e0788f148
=======

export enum Difficulty {
    Easy = 0,
    Normal = 1,
    Hard = 2
}

>>>>>>> Ajout des boutons et correction du code en fonction des normes

@Component({
    selector: "app-difficulty",
    templateUrl: "./difficulty.component.html",
    styleUrls: ["./difficulty.component.css"]
})

export class DifficultyComponent implements OnInit {

<<<<<<< 10b8482b07a4e3f861d998db93acc32e0788f148
    private _selectedDifficulty: string = "Easy";
    private _difficulties: string[];

    public constructor() {
        this._difficulties = ["Easy", "Normal", "Hard"];
    }

    public onSelect(diff: string): void {
        this._selectedDifficulty = diff;
=======
    private _selectedDifficulty: string;
    private _difficulties: string[];

    public onSelect(diff: string): void {
        this._selectedDifficulty = diff;
    }

    public constructor() {
        this._difficulties = ["Easy", "Normal", "Hard"];
>>>>>>> Ajout des boutons et correction du code en fonction des normes
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
