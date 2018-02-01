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

    //  public word: Word;
    private _selectedCase: Case;
    private _word: Word;
    private _x: number;
    private _y: number;

    public findWordStart(): Word {
        const tempIndex: Array<number> = [this._x, this._y];
        let tempOrientation: Orientation;

        /* If letter */
        if (this.isLetter(this._grid[tempIndex[0]][tempIndex[1]].char)) {
            /* Go back by col indexes if possible */
            if (tempIndex[1] - 1 >= 0 &&
                this.isLetter(this._grid[tempIndex[0]][tempIndex[1] - 1].char)) {
                tempOrientation = Orientation.horizontal;
                while (tempIndex[1] - 1 >= 0 &&
                    this.isLetter(this._grid[tempIndex[0]][tempIndex[1] - 1].char)) {
                    tempIndex[1]--;
                }
            /* else go back by row indexes if possible */
            } else if (tempIndex[0] - 1 >= 0 &&
                this.isLetter(this._grid[tempIndex[0] - 1][tempIndex[1]].char)) {
                tempOrientation = Orientation.vertical;
                while (tempIndex[0] - 1 >= 0 &&
                    this.isLetter(this._grid[tempIndex[0] - 1][tempIndex[1]].char)) {
                    tempIndex[0]--;
                }
            }
            /* else already (or is now) at word start. return as is */
        }

        return new Word("", "", tempIndex, tempOrientation);
    }

    // Select from case to clue (call word.service)
    public selectCaseFromUser(c: Case): void {
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

    // Select from clue to case (called by work.service)
    private selectCaseFromService(c: Case): void {
        if (this._selectedCase != null) {
            this._selectedCase.unselect();
        }
        c.select();
        this._selectedCase = c;
        this._x = c.x;
        this._y = c.y;
    }

    public validateChar(event: KeyboardEvent): void {
        const constraint: RegExp = /^[a-z]+$/i;
        if (!constraint.test(String.fromCharCode(event.charCode))) {
            event.preventDefault();
        }
    }

    public isLetter(letter: string): boolean {
        return (/[a-z]/i.test(letter) && letter.length === 1);
    }

    public constructor(private _wordService: WordService) { }

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
            }
        );
    }

    public nextCase(): void {
        if (this.isLetter(this._selectedCase.char)) {
            if (this._x + 1 < this._grid.length) {
                this._x++;
                this.selectCaseFromUser(this._grid[this._x][this._y]);
            } else {
                this._selectedCase.unselect();
            }
        }
    }

}
