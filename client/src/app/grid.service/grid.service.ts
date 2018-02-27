/* tslint:disable:no-shadowed-variable */
// tslint:disable:no-suspicious-comment

import { Injectable } from "@angular/core";
import { GRID } from "../mock-grid";
import { Case } from "../../../../common/grid/case";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import Word, { Orientation } from "../../../../common/lexical/word";

import { WordService } from "../word.service/word.service";
import { SocketService } from "../socket.service/socket.service";
import CLUES from "../mock-words";
const BACK_SPACE_KEY_CODE: number = 8;

@Injectable()
export class GridService {

    private _grid: Array<Array<Case>>;
    private _isHorizontal: boolean;
    private _selectedWord: Case;
    private _selWord: Word;
    private _wordStart: number;
    private _word: Word;
    private _row: number;
    private _col: number;
    private _otherWord: Word;

    public constructor(
        private _wordService: WordService,
        private socketService: SocketService
    ) {

        this._wordService.wordFromClue.subscribe(
            (_wordFromClue) => {
                this._word = _wordFromClue, this.selectCaseFromService(_wordFromClue);
            });

        this.socketService.cellToHighlight.subscribe(
            (data: string) => {
                const { word }: { word: Word } = JSON.parse(data);
                const selectedWord: Word = CLUES.find((w: Word) => word !== null && w.index === word.index);
                this.selectOtherPlayerWord(selectedWord || null);
            });

        this.socketService.wordIsValidated.subscribe(
            (data: string) => {
                const { word }: { word: Word } = JSON.parse(data);
                const selectedWord: Word = CLUES.find((w: Word) => word !== null && w.index === word.index);
                this.applyValidation(selectedWord, true);
            });

        this.initGrid();
    }

    private initGrid(): void {
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

                this._grid[i][j].wordIndexes = this.wordsStartAtPosition(i, j);
            }
        }
    }

    public get grid(): Array<Array<Case>> {
        return this._grid;
    }

    public selectOtherPlayerWord(w: Word): void {

        if (this._otherWord) {
            this.iterateOtherWord(this._otherWord, (row: number, col: number) => {
                this._grid[row][col].isOtherPlayer = false;
            });
        }

        this._otherWord = w;
        if (w) {
            this.iterateOtherWord(w, (row: number, col: number) => {
                this._grid[row][col].isOtherPlayer = true;
            });
        }

    }

    public iterateOtherWord(w: Word, fct: Function): void {
        const wordStart: number = w.orientation === Orientation.horizontal ?  w.col : w.row;
        for (let cell: number = wordStart; cell < wordStart + w.length; cell++) {
            const cellTemp: Case = w.orientation === Orientation.horizontal ? this._grid[w.row][cell] : this._grid[cell][w.col];
            fct(cellTemp.x, cellTemp.y);
        }
    }

    private selectCaseFromService(w: Word): void {
        this.selectCells(w);
        this.socketService.syncWord(w);
    }

    private selectCells(w: Word, isMe: boolean = true): void {

        if (this._selectedWord != null) {
            const cellTemp: Case = this._selectedWord;

            this.iterateWord(cellTemp, (x: number, y: number, caseTest: Case) => {
                this._grid[x][y].unselect();
            });
        }

        if (w != null) {
            this._grid[w.row][w.col].select();
            this._row = w.row;
            this._col = w.col;
            this.findEndWrittenWord();
            this.wordHighligth();
        }
    }

    private wordsStartAtPosition(row: number, col: number): Array<number> {
        return CLUES.filter((word: Word): boolean => word.position[0] === row && word.position[1] === col)
            .map((word: Word): number => word.index + 1);
    }

    public selectCaseFromGrid(c: Case): void {

        this._row = c.x;
        this._col = c.y;
        const tempWord: Word = this.findWordStart();
        this._wordService.selectWordFromGrid(tempWord);

        if (this._selectedWord != null) {
            const cellTemp: Case = this._selectedWord;

            this.iterateWord(cellTemp, (x: number, y: number) => {
                this._grid[x][y].unselect();
            });
        }

        if (this._word != null) {
            this._grid[tempWord.row][tempWord.col].select();
            this._row = this._grid[tempWord.row][tempWord.col].x;
            this._col = this._grid[tempWord.row][tempWord.col].y;
            this.findEndWrittenWord();
            this.wordHighligth();
        } else {
            const elem: HTMLElement = document.getElementById(c.x.toString() + (c.y).toString());
            elem.blur();
        }
    }

    private findWordStart(): Word {
        let tempOrientation: Orientation;

        if (!this.isBlack(this._grid[this._row][this._col].char)) {
            if (this.previousHorizontalIsNotBlack() || this.nextHorizontalIsNotBlack()) {

                this.findHorizontalWordStart();
                tempOrientation = Orientation.horizontal;
            } else {
                this.findVerticalWordStart();
                tempOrientation = Orientation.vertical;
            }
        }

        return new Word("", "", [this._row, this._col], tempOrientation, 0, false);
    }

    public isBlack(letter: string): boolean {
        return (/\-/.test(letter) && letter.length === 1);
    }

    private findHorizontalWordStart(): void {
        while (this.previousHorizontalIsNotBlack()) {
            this._col--;
        }
    }

    private findVerticalWordStart(): void {
        while (this.previousVerticalIsNotBlack()) {
            this._row--;
        }
    }

    private previousHorizontalIsNotBlack(): boolean {
        return (this._col - 1 >= 0 && !this.isBlack(this._grid[this._row][this._col - 1].char));
    }

    private nextHorizontalIsNotBlack(): boolean {
        return (this._col + 1 < this._grid[this._row].length && !this.isBlack(this._grid[this._row][this._col + 1].char));
    }

    private previousVerticalIsNotBlack(): boolean {
        return (this._row - 1 >= 0 && !this.isBlack(this._grid[this._row - 1][this._col].char));
    }

    private highligthCell (row: number, col: number): void {
        this._grid[row][col].select();
    }

    private wordHighligth(): void {
        const currentCase: Case = null;

        this.iterateWord(currentCase, (x: number, y: number, cellTemp: Case, cell: number) => {
            this.highligthCell(cellTemp.x, cellTemp.y);
            if (cellTemp.char === "-") { return true; }

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
        const cellTemp: Case = null;
        let wordEntered: string = "";
        this._selWord = this._word;
        this.isHorizontal() ? wordStart = this._word.col : wordStart = this._word.row;
        this._wordStart = wordStart;
        this._isHorizontal = this.isHorizontal();

        this.iterateWord(cellTemp, (x: number, y: number, cellTemp: Case, cell: number) => {
            this._grid[x][y].unselect();
            if (cell === wordStart) {
                this._selectedWord = cellTemp;
            }
            this._grid[cellTemp.x][cellTemp.y].select();
            if (cellTemp.char === "" || cell === wordStart + this._word.length - 1) {
                wordEntered += cellTemp.char;
                const elem: HTMLElement = document.getElementById(cellTemp.x.toString() + cellTemp.y.toString());
                elem.focus();
                if (cell === wordStart + this._word.length - 1) {
                    this.validateWord(wordEntered, elem);
                }

                return true;
            } else {
                wordEntered += cellTemp.char;

                return false;
            }
        });
    }

    private isHorizontal(): boolean {
        return this._word.orientation === Orientation.horizontal;
    }

    private iterateWord(cellTemp: Case, fct: Function): void {
        for (let cell: number = this._wordStart; cell < this._wordStart + this._selWord.length; cell++) {
            this._isHorizontal ? cellTemp = this._grid[this._selWord.row][cell] : cellTemp = this._grid[cell][this._selWord.col];

            if (fct(cellTemp.x, cellTemp.y, cellTemp, cell, stop)) {
                break;
            }
        }
    }

    public validateWord(enteredWord: string, elem: HTMLElement): void {
        if (this._word.name.toUpperCase() === enteredWord.toUpperCase()) {
            this.applyValidation(this._word);
            this._word.isValidated = true;
            this.socketService.sendValidation(this._word);
            elem.blur();
        }
    }

    public applyValidation(word: Word, isOther: boolean = false): void {
        let tempX: number = word.row;
        let tempY: number = word.col;
        let i: number = 0;
        while (i < word.length) {
            this._grid[tempX][tempY].validate();
            if (isOther) {
                this._grid[tempX][tempY].isOtherPlayer = true;
                this._grid[tempX][tempY].char = word.name[i];
            }
            word.orientation === Orientation.horizontal ? tempY++ : tempX++;
            i++;
        }
    }

    public get word(): Word {
        return this._word;
    }

    public set word(word: Word) {
        this._word = word;
    }

}
