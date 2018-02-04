import { Component, OnInit } from "@angular/core";

import { Case } from "../case";
import Word, { Orientation } from "../../../../../common/lexical/word";
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

    private previousHorizontalIsNotBlack(): boolean {
        return (this._y - 1 >= 0 && this.isLetter(this._grid[this._x][this._y - 1].char));
    }

    private previousVerticalIsNotBlack(): boolean {
        return (this._x - 1 >= 0 && this.isLetter(this._grid[this._x - 1][this._y].char));
    }

    private findHorizontalWordStart(): void {
        while (this.previousHorizontalIsNotBlack()) {
            this._y--;
        }
    }

    private findVerticalWordStart(): void {
        while (this.previousVerticalIsNotBlack()) {
            this._x--;
        }
    }

    private findWordStart(): Word {
        let tempOrientation: Orientation;

        if (this.isLetter(this._grid[this._x][this._y].char)) {
            if (this.previousHorizontalIsNotBlack()) {
                this.findHorizontalWordStart();
                tempOrientation = Orientation.horizontal;
            } else if (this.previousVerticalIsNotBlack()) {
                this.findVerticalWordStart();
                tempOrientation = Orientation.vertical;
            } else {
                tempOrientation = Orientation.horizontal;
            }
        }

        return new Word("", "", [this._x, this._y], tempOrientation);
    }

    // selectCaseOnGrid
    public selectCaseFromUser(c: Case): void {
        this._x = c.x;
        this._y = c.y;
        const tempWord: Word = this.findWordStart();
        this._wordService.selectWordFromGrid(tempWord);

        if (this._selectedCase != null) {
            this._selectedCase.unselect();
        }

        this._grid[tempWord.row][tempWord.col].select();
        this._selectedCase = this._grid[tempWord.row][tempWord.col];
        this._x = this._grid[tempWord.row][tempWord.col].x;
        this._y = this._grid[tempWord.row][tempWord.col].y;
        this.findEndWrittenWord();
    }

    private selectCaseFromService(c: Case): void {

        if (this._selectedCase != null) {
            this._selectedCase.unselect();
        }

        c.select();
        this._selectedCase = c;
        this._x = c.x;
        this._y = c.y;
        this.findEndWrittenWord();

    }

    private isHorizontal(): boolean {
        return this._word.direction === Orientation.horizontal;
    }

    private findEndWrittenWord(): void {
        let wordStart: number = 0;
        let caseTemp: Case;
        this.isHorizontal() ? wordStart = this._word.col : wordStart = this._word.row;
        for (let cell: number = wordStart; cell < wordStart + this._word.length; cell++) {

            this.isHorizontal() ? caseTemp = this._grid[this._word.row][cell] : caseTemp = this._grid[cell][this._word.col];
            if (caseTemp.char === "" || cell === wordStart + this._word.length - 1) {
                const elem: HTMLElement = document.getElementById(caseTemp.x.toString() + (caseTemp.y).toString());
                elem.focus();
                break;
            }
        }
    }

    private erasePrevious(c: Case): void {

        if (this.isHorizontal()) {
            this._grid[c.x][c.y - 1].char = "";
        } else {
            this._grid[c.x - 1][c.y].char = "";
        }
    }
    public validateChar(event: KeyboardEvent, c: Case): void {
        const constraint: RegExp = /^[a-z]+$/i;
        if (!constraint.test(String.fromCharCode(event.charCode))) {
            event.preventDefault();
        } else {
            c.char = (String.fromCharCode(event.charCode));
            this.findEndWrittenWord();
        }
    }

    public eraseLetter(event: KeyboardEvent, c: Case): void {
        const backspaceKeyCode: number = 8;
        if (event.keyCode === backspaceKeyCode) {
            if (c.char === "") {
                this.erasePrevious(c);
            }
            c.char = "";
            this.findEndWrittenWord();
        }
    }

    public isLetter(letter: string): boolean {
        return (/[a-z]/i.test(letter) && letter.length === 1);
    }

    public ngOnInit(): void {
        for (let i: number = 0; i < this._grid.length; i++) {
            for (let j: number = 0; j < this._grid[i].length; j++) {
                this._grid[i][j].x = i;
                this._grid[i][j].y = j;
            }
        }
        this._wordService.wordFromClue.subscribe(
            (_wordFromClue) => {
                this._word = _wordFromClue,
                    this.selectCaseFromService(this._grid[_wordFromClue.row][_wordFromClue.col]);
            });
    }

}
