/* tslint:disable:no-shadowed-variable */

import { Injectable } from "@angular/core";
import { GRID } from "../mock-grid";
import { Case } from "../../../../common/grid/case";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import Word, { Orientation } from "../../../../common/lexical/word";
import { WordService } from "../word.service/word.service";

const BACK_SPACE_KEY_CODE: number = 8;

@Injectable()
export class GridService {

    private _wordService: WordService;

    public _grid: Array<Array<Case>>;
    private _isHorizontal: boolean;
    private _selectedWord: Case;
    private _selWord: Word;
    private _wordStart: number;
    private _word: Word;
    private _x: number;
    private _y: number;

    public constructor() {
        this._grid = GRID.map((row: string) => {
            const strings: Array<string> = row.split(" ");

            return strings.map((c: string) => new Case(c));
        });

        for (let i: number = 0; i < this._grid.length; i++) {
            for (let j: number = 0; j < this._grid[i].length; j++) {
                this._grid[i][j].x = i;
                this._grid[i][j].y = j;
                if (this._grid[i][j].char === "_") {
                    this._grid[i][j].char = "";
                }
            }
        }
    }

    public intializeGrid(): Array<Array<Case>> {
        this._grid = GRID.map((row: string) => {
            const strings: Array<string> = row.split(" ");

            return strings.map((c: string) => new Case(c));
        });

        for (let i: number = 0; i < this._grid.length; i++) {
            for (let j: number = 0; j < this._grid[i].length; j++) {
                this._grid[i][j].x = i;
                this._grid[i][j].y = j;
                if (this._grid[i][j].char === "_") {
                    this._grid[i][j].char = "";
                }
            }
        }
        // this._wordService.wordFromClue.subscribe(
        //     (_wordFromClue) => {this._word = _wordFromClue,
        //         this.selectCaseFromService(_wordFromClue);
        //     });

        return this._grid;
    }

    public get grid(): Array<Array<Case>> {
        return GRID.map((row: string) => {
            const strings: Array<string> = row.split(" ");

            return strings.map((c: string) => new Case(c));
        });
    }

    private selectCaseFromService(w: Word): void {

        if (this._selectedWord != null) {
            const caseTemp: Case = this._selectedWord;

            this.iterateGrid(caseTemp, (x: number, y: number, caseTest: Case) => {
                this._grid[x][y].unselect();
            });

        }

        if (w != null) {
            this._grid[w.row][w.col].select();
            this._x = w.row;
            this._y = w.col;
            this.findEndWrittenWord();
            this.wordHighlight();
        }
    }

    public selectCaseFromGrid(c: Case): void {
        this._wordService.wordFromClue.subscribe(
            (_wordFromClue) => {this._word = _wordFromClue,
                this.selectCaseFromService(_wordFromClue);
        });
        this._x = c.x;
        this._y = c.y;
        const tempWord: Word = this.findWordStart();
        this._wordService.selectWordFromGrid(tempWord);

        if (this._selectedWord != null) {
            const caseTemp: Case = this._selectedWord;

            this.iterateGrid(caseTemp, (x: number, y: number) => {
                this._grid[x][y].unselect();
            });
        }

        if (this._word != null) {
            this._grid[tempWord.row][tempWord.col].select();
            this._x = this._grid[tempWord.row][tempWord.col].x;
            this._y = this._grid[tempWord.row][tempWord.col].y;
            this.findEndWrittenWord();
            this.wordHighlight();
        } else {
            const elem: HTMLElement = document.getElementById(c.x.toString() + (c.y).toString());
            elem.blur();
        }
    }

    private findWordStart(): Word {
        let tempOrientation: Orientation;

        if (!this.isBlack(this._grid[this._x][this._y].char)) {
            if (this.previousHorizontalIsNotBlack() || this.nextHorizontalIsNotBlack()) {

                this.findHorizontalWordStart();
                tempOrientation = Orientation.horizontal;
            } else {
                this.findVerticalWordStart();
                tempOrientation = Orientation.vertical;
            }
        }

        return new Word("", "", [this._x, this._y], tempOrientation, 0, false);
    }

    public isBlack(letter: string): boolean {
        return (/\-/.test(letter) && letter.length === 1);
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

    private previousHorizontalIsNotBlack(): boolean {
        return (this._y - 1 >= 0 && !this.isBlack(this._grid[this._x][this._y - 1].char));
    }

    private nextHorizontalIsNotBlack(): boolean {
        return (this._y + 1 < this._grid[this._x].length && !this.isBlack(this._grid[this._x][this._y + 1].char));
    }

    private previousVerticalIsNotBlack(): boolean {
        return (this._x - 1 >= 0 && !this.isBlack(this._grid[this._x - 1][this._y].char));
    }

    private wordHighlight(): void {
        const currentCase: Case = null;

        this.iterateGrid(currentCase, (x: number, y: number, caseTemp: Case, cell: number) => {
            this._grid[caseTemp.x][caseTemp.y].select();
            if (caseTemp.char === "-") {

                return true;
            }

            return false;
        });
    }

    public updateGrid(event: KeyboardEvent, c: Case): Observable<Array<Array<Case>>> {
        if (event.keyCode === BACK_SPACE_KEY_CODE) {
            if (c.char === "") {
                this.erasePrevious(c);
            }
            c.char = "";
            this.findEndWrittenWord();
        }
        if (!this.isLetter(String.fromCharCode(event.charCode))) {
            event.preventDefault();
        } else {
            c.char = (String.fromCharCode(event.charCode));
            this.findEndWrittenWord();
        }

        return of(this._grid);
    }

    private erasePrevious(c: Case): void {

        if (this.isHorizontal() && (c.y !== this._word.col)) {
            if (this._grid[c.x][c.y - 1].validated) {
                this.erasePrevious(this._grid[c.x][c.y - 1]);
            } else {
                this._grid[c.x][c.y - 1].char = "";
            }
        } else if (c.x !== this._word.row) {
            if (this._grid[c.x - 1][c.y].validated) {
                this.erasePrevious(this._grid[c.x - 1][c.y]);
            } else {
                this._grid[c.x - 1][c.y].char = "";
            }
        }
    }

    public isLetter(element: string): boolean {
        const constraint: RegExp = /^[a-z]+$/i;

        return constraint.test(element);
    }

    private findEndWrittenWord(): void {
        let wordStart: number = 0;
        const caseTemp: Case = null;
        let wordEntered: string = "";
        this._selWord = this._word;
        this.isHorizontal() ? wordStart = this._word.col : wordStart = this._word.row;
        this._wordStart = wordStart;
        this._isHorizontal = this.isHorizontal();

        this.iterateGrid(caseTemp, (x: number, y: number, caseTemp: Case, cell: number) => {
            this._grid[x][y].unselect();
            if (cell === wordStart) {
                this._selectedWord = caseTemp;
            }
            this._grid[caseTemp.x][caseTemp.y].select();
            if (caseTemp.char === "" || cell === wordStart + this._word.length - 1) {
                wordEntered += caseTemp.char;
                const elem: HTMLElement = document.getElementById(caseTemp.x.toString() + (caseTemp.y).toString());
                elem.focus();
                if (cell === wordStart + this._word.length - 1) {
                    this.validateWord(wordEntered, elem);
                }

                return true;
            } else {
                wordEntered += caseTemp.char;

                return false;
            }
        });
    }

    private isHorizontal(): boolean {
        return this._word.orientation === Orientation.horizontal;
    }

    private iterateGrid(caseTemp: Case, fct: Function): void {
        for (let cell: number = this._wordStart; cell < this._wordStart + this._selWord.length; cell++) {
            this._isHorizontal ? caseTemp = this._grid[this._selWord.row][cell] : caseTemp = this._grid[cell][this._selWord.col];

            if (fct(caseTemp.x, caseTemp.y, caseTemp, cell, stop)) {
                break;
            }
        }
    }

    public validateWord(enteredWord: string, elem: HTMLElement): void {
        if (this._word.name.toUpperCase() === enteredWord.toUpperCase()) {
            let tempX: number = this._word.row;
            let tempY: number = this._word.col;
            let i: number = 0;
            while (i < this._word.length) {
                this._grid[tempX][tempY].validate();
                this.isHorizontal() ? tempY++ : tempX++;
                i++;
            }
            this._word.isValidated = true;
            elem.blur();
        }
    }

}
