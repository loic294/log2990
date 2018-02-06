import { Component, OnInit } from "@angular/core";

import { Case } from "../../../../../common/grid/case";
import Word, { Orientation } from "../../../../../common/lexical/word";
import { WordService } from "../../word.service/word.service";

import {GRID} from "../mock-grid";

@Component({
    selector: "app-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"]
})

export class GridComponent implements OnInit {

    private _grid: Array<Array<Case>> = GRID;

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

    public set word(w: Word) {
        this._word = w;
    }

    private previousHorizontalIsNotBlack(): boolean {
        return (this._y - 1 >= 0 && !this._grid[this._x][this._y - 1].isBlack);
    }

    private nextHorizontalIsNotBlack(): boolean {
        return (this._y + 1 < this._grid[this._x].length && !this._grid[this._x][this._y - 1].isBlack);
    }

    private previousVerticalIsNotBlack(): boolean {
        return (this._x - 1 >= 0 && !this._grid[this._x][this._y - 1].isBlack);
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

        if (!this._grid[this._x][this._y - 1].isBlack) {
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

    public selectCaseFromGrid(c: Case): void {

            this._x = c.x;
            this._y = c.y;
            const tempWord: Word = this.findWordStart();
            this._wordService.selectWordFromGrid(tempWord);

            if (this._selectedCase != null) {
                this._selectedCase.unselect();
            }

            if (this._word != null) {
                this._grid[tempWord.row][tempWord.col].select();
                this._selectedCase = this._grid[tempWord.row][tempWord.col];
                this._x = this._grid[tempWord.row][tempWord.col].x;
                this._y = this._grid[tempWord.row][tempWord.col].y;
                this.findEndWrittenWord();
            } else {
                const elem: HTMLElement = document.getElementById(c.x.toString() + (c.y).toString());
                elem.blur();
            }
    }

    private selectCaseFromService(w: Word): void {

        if (this._selectedCase != null) {
            this._selectedCase.unselect();
        }

        if (w != null) {
            this._grid[w.row][w.col].select();
            this._selectedCase = this._grid[w.row][w.col];
            this._x = w.row;
            this._y = w.col;
            this.findEndWrittenWord();
        }
    }

    private isHorizontal(): boolean {
        return this._word.direction === Orientation.horizontal;
    }

    private findEndWrittenWord(): void {
        let wordStart: number = 0;
        let caseTemp: Case;
        let wordEntered: string = "";
        this.isHorizontal() ? wordStart = this._word.col : wordStart = this._word.row;
        for (let cell: number = wordStart; cell < wordStart + this._word.length; cell++) {
            this.isHorizontal() ? caseTemp = this._grid[this._word.row][cell] : caseTemp = this._grid[cell][this._word.col];

            if (caseTemp.char === "" || cell === wordStart + this._word.length - 1) {
                wordEntered += caseTemp.char;
                const elem: HTMLElement = document.getElementById(caseTemp.x.toString() + (caseTemp.y).toString());
                elem.focus();
                if (cell === wordStart + this._word.length - 1) {
                    this.validateWord(wordEntered, elem);
                }
                break;
            } else {
                wordEntered += caseTemp.char;
            }
        }
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

    public validateChar(event: KeyboardEvent, c: Case): void {
        if (!this.isLetter(String.fromCharCode(event.charCode))) {
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

    public validateWord(enteredWord: string, elem: HTMLElement): void {
        if (this._word.name.toUpperCase() === enteredWord.toUpperCase()) {
            let tempX: number = this._word.row;
            let tempY: number = this._word.col;
            let i: number = 0;
            while (i < this._word.length ) {
                this._grid[tempX][tempY].validate();
                this.isHorizontal() ? tempY++ : tempX++;
                i++;
            }
            this._word.validate();
            elem.blur();
        }
    }

    public ngOnInit(): void {
        this._wordService.wordFromClue.subscribe(
            (_wordFromClue) => {this._word = _wordFromClue,
                this.selectCaseFromService(_wordFromClue);
            });
    }

}
