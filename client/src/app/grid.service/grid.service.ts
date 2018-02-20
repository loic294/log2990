/* tslint:disable:no-shadowed-variable */

import { Injectable } from "@angular/core";
import { GRID } from "../mock-grid";
import { Case } from "../../../../common/grid/case";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import Word, { Orientation } from "../../../../common/lexical/word";

const BACK_SPACE_KEY_CODE: number = 8;

@Injectable()
export class GridService {

    private _grid: Array<Array<Case>>;
    private _isHorizontal: boolean;
    private _selectedWord: Case;
    private _selWord: Word;
    private _wordStart: number;
    private _word: Word;
    private _x: number;
    private _y: number;

    public intializeGrid(): Array<Array<Case>> {
        return GRID.map((row: string) => {
            const strings: Array<string> = row.split(" ");

            return strings.map((c: string) => new Case(c));
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
        return this._word.direction === Orientation.horizontal;
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
            this._word.validate();
            elem.blur();
        }
    }

}
