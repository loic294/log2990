import { Component, OnInit } from "@angular/core";

import { Case } from "../case";
import Word from "../../../../../common/lexical/word";

import { WordService } from "../../word.service/word.service";

/** TEMPORARY MOCKED CONTENT
   * Example table
   * **/

const grid: Array<String> = [
    "- - - - - - - - P -",
    "- - - - A - C L U E",
    "W O U N D - R - S -",
    "O - - - V - O - H -",
    "R - - - E - S - - -",
    "R - F I N I S H - C",
    "Y - - - T - W - - R",
    "- M E N U - O - - A",
    "- - - - R - E - - C",
    "G R A V E - D O C K",
];

@Component({
    selector: "app-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"]
})
export class GridComponent implements OnInit {

    private _grid: Array<Array<Case>> = grid.map((row: string) => {
        const strings: Array<string> = row.split(" ");

        return strings.map((c: string) => new Case(c));
    });

    //  public word: Word;
    private _selectedCase: Case;
    private _word: Word;
    private _x: number;
    private _y: number;

	
    public validateChar(event: any): void {
		event.preventDefault()
		event.target.value = event.target.value.replace(/[^a-z]/ig, "")
    }

    public isLetter(letter: string): boolean {
        return (/[a-z]/i.test(letter) && letter.length === 1);
    }

    public selectCase(c: Case): void {
        if (this._selectedCase != null) {
            this._selectedCase.unselect();
        }
        c.select();
        this._selectedCase = c;
        this._x = c.x;
        this._y = c.y;
    }

    public nextCase(): void {
        if (this.isLetter(this._selectedCase.char)) {
            if (this._x + 1 < this._grid.length) {
                this._x++;
                this.selectCase(this._grid[this._x][this._y]);
            } else {
                this._selectedCase.unselect();
            }
        }
    }

    public enterWord(): void {
        this._wordService.word.subscribe((_word) => this._word = _word);
        this.selectCase(this._grid[this._word.col][this._word.row]);
    }

    public constructor(private _wordService: WordService) { }

    public ngOnInit(): void {
        for (let i: number = 0; i < this._grid.length; i++) {
            for (let j: number = 0; j < this._grid[i].length; j++) {
                this._grid[i][j].x = i;
                this._grid[i][j].y = j;
            }
        }

        this.enterWord();
    }

}
