import { Component, OnInit } from "@angular/core";

import { Case } from "../case";
import Word, {Orientation} from "../../../../../common/lexical/word";
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

    private _selectedCase: Case;
    private _word: Word;
    private _x: number;
    private _y: number;

    public constructor(private _wordService: WordService) { }

    public get grid(): Array<Array<Case>> {
        return this._grid;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get word(): Word {
        return this._word;
    }

    private findHorizontalWordStart(): void {
        while (this._y - 1 >= 0 && !this.isBlack(this._grid[this._x][this._y - 1].char)) {
            this._y--;
        }
    }

    private findVerticalWordStart(): void {
        while (this._x - 1 >= 0 && !this.isBlack(this._grid[this._x - 1][this._y].char)) {
            this._x--;
        }
    }

    private findWordStart(): Word {
        let tempOrientation: Orientation;

        if (!this.isBlack(this._grid[this._x][this._y].char)) {
            if (this._y - 1 >= 0 && !this.isBlack(this._grid[this._x][this._y - 1].char)) {
                this.findHorizontalWordStart();
                tempOrientation = Orientation.horizontal;
            } else {
                this.findVerticalWordStart();
                tempOrientation = Orientation.vertical;
            }
        }

        return new Word("", "", [this._x, this._y], tempOrientation);
    }

    public selectCaseFromUser(c: Case): void {
        if (!c.validated) {
            this._x = c.x;
            this._y = c.y;
            const tempWord: Word = this.findWordStart();
            this._wordService.selectWordFromGrid(tempWord);

            if (this._selectedCase != null) {
                this._selectedCase.unselect();
            }

            this._grid[tempWord.col][tempWord.row].select();
            this._selectedCase = this._grid[tempWord.col][tempWord.row];
            this._x = this._grid[tempWord.col][tempWord.row].x;
            this._y = this._grid[tempWord.col][tempWord.row].y;
        }
    }

    private selectCaseFromService(c: Case): void {
        if (!c.validated) {
            if (this._selectedCase != null) {
                this._selectedCase.unselect();
            }
            c.select();
            this._selectedCase = c;
            this._x = c.x;
            this._y = c.y;
        }
    }

    public validateChar(event: KeyboardEvent): void {
        const constraint: RegExp = /^[a-z]+$/i;

        if (!constraint.test(String.fromCharCode(event.charCode))) {
            event.preventDefault();
        }
    }

    public isBlack(letter: string): boolean {
        return (/\-/.test(letter) && letter.length === 1);
    }

    public ngOnInit(): void {
        for (let i: number = 0; i < this._grid.length; i++) {
            for (let j: number = 0; j < this._grid[i].length; j++) {
                this._grid[i][j].x = i;
                this._grid[i][j].y = j;
            }
        }
        this._wordService.wordFromClue.subscribe(
            (_wordFromClue) => {this._word = _wordFromClue,
                this.selectCaseFromService(this._grid[_wordFromClue.col][_wordFromClue.row]);
            });
    }

}
