/* tslint:disable:no-shadowed-variable */
// tslint:disable:no-suspicious-comment

import { Injectable } from "@angular/core";
import { GRID } from "../mock-grid";
import { Cell } from "../../../../common/grid/cell";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import Word, { Orientation } from "../../../../common/lexical/word";
import { GridTools } from "./grid.tools";

import { WordService } from "../word.service/word.service";
import { SocketService } from "../socket.service/socket.service";
import CLUES from "../mock-words";
const BACK_SPACE_KEY_CODE: number = 8;

@Injectable()
export class GridService {

    private _grid: Array<Array<Cell>>;
    private _selectedWord: Cell;
    private _word: Word;
    private _otherWord: Word;
    private _gridTools: GridTools;

    public constructor(
        private _wordService: WordService,
        private socketService: SocketService
    ) {

        this._gridTools = new GridTools();
        this.initGrid();
        this.initServicesListeners();
    }

    private initServicesListeners(): void {
        this._wordService.wordFromClue.subscribe(
            (_wordFromClue: Word) => {
                if (_wordFromClue) {
                    this._word = _wordFromClue;
                    this.selectCaseFromService(_wordFromClue);
                }
            });

        this.socketService.cellToHighligh.subscribe(
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
    }

    private selectCaseFromService(w: Word): void {
        this.selectCells(w);
        this.socketService.syncWord(w);
    }

    public selectOtherPlayerWord(w: Word): void {

        this._gridTools.setGrid(this._grid);

        if (this._otherWord) {
             this._gridTools.iterateWord(this._otherWord, (row: number, col: number) => {
                this._grid[row][col].isOtherPlayer = false;
           });
        }

        this._otherWord = w;
        if (w) {
            this._gridTools.iterateWord(w, (row: number, col: number) => {
                this._grid[row][col].isOtherPlayer = true;
            });
        }

    }

    public applyValidation(word: Word, isOther: boolean = false): void {
        let tempX: number = word.row;
        let tempY: number = word.col;
        let i: number = 0;
        if (!word) {
            this._gridTools.iterateWord(word, (row: number, col: number) => {
                this._grid[row][col].isOtherPlayer = false;
            });
        }
        while (i < word.length) {
            if (!isOther) {
                this._grid[tempX][tempY].validate();
            }
            if (isOther) {
                this._grid[tempX][tempY].isOtherPlayer = true;
                this._grid[tempX][tempY].validateOther();
                this._grid[tempX][tempY].char = word.name[i];
            }
            word.orientation === Orientation.horizontal ? tempY++ : tempX++;
            i++;
        }
    }

    private selectCells(w: Word, isMe: boolean = true): void {

        this._gridTools.setGrid(this._grid);

        if (this._selectedWord != null) {
            this._gridTools.iterateGrid(this._grid, (row: number, col: number) => {
                if (this._grid[row][col].selected) {
                    this._grid[row][col].unselect();
                }
            });
        }

        if (w != null) {
            this._grid[w.row][w.col].select();
            this.findEndWrittenWord();
            this.wordHighligth();
        }
    }

    public selectCaseFromGrid(c: Cell): void {

        const tempWord: Word = this.findWordStart(c.x, c.y);
        this._wordService.selectWordFromGrid(tempWord);
        this.selectCells(tempWord);

        if (this._word === null) {
            const elem: HTMLElement = document.getElementById(c.id);
            elem.blur();
        }
    }

    private findWordStart(row: number, col: number): Word {
        this._gridTools.setPosition(row, col);
        this._gridTools.setGrid(this._grid);

        return this._gridTools.findWordStart();
    }

    private wordHighligth(): void {
        this._gridTools.setGrid(this._grid);
        this._gridTools.iterateWord(this._word, (x: number, y: number, cellTemp: Cell, cell: number) => {
            this._grid[cellTemp.x][cellTemp.y].select();
            if (cellTemp.char === "-") { return true; }

            return false;
        });
    }

    public updateGrid(event: KeyboardEvent, c: Cell): Observable<Array<Array<Cell>>> {

        if (event.keyCode === BACK_SPACE_KEY_CODE) {
            if (c.char === "") {
                this.erasePrevious(c);
            }
            c.char = "";
            this.findEndWrittenWord();
        }

        if (!this._gridTools.isLetter(String.fromCharCode(event.charCode))) {
            event.preventDefault();
        } else {
            c.char = (String.fromCharCode(event.charCode));
            this.findEndWrittenWord();
        }

        return of(this._grid);
    }

    private erasePrevious(c: Cell): void {

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

    private findEndWrittenWord(): void {
        let wordStart: number = 0;
        let wordEntered: string = "";
        this.isHorizontal() ? wordStart = this._word.col : wordStart = this._word.row;

        this._gridTools.iterateWord(this._word, (x: number, y: number, cellTemp: Cell, cell: number) => {
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

    public validateWord(enteredWord: string, elem: HTMLElement): void {
        if (this._word.name.toUpperCase() === enteredWord.toUpperCase()) {
            this.applyValidation(this._word);
            this._word.isValidated = true;
            this.socketService.sendValidation(this._word);
            elem.blur();
        }
    }

    private initGrid(): void {
        this._grid = GRID.map((row: string) => {
            const strings: Array<string> = row.split(" ");

            return strings.map((c: string) => new Cell(c));
        });

        this._gridTools.iterateGrid(this._grid, (row: number, col: number) => {
            this._grid[row][col].x = row;
            this._grid[row][col].y = col;
            if (this._grid[row][col].char === "_") {
                this._grid[row][col].char = "";
            }

            this._grid[row][col].wordIndexes = this._gridTools.wordsStartAtPosition(row, col);
        });

    }

    private isHorizontal(): boolean {
        return this._word.orientation === Orientation.horizontal;
    }

    public get grid(): Array<Array<Cell>> {
        return this._grid;
    }

    public get word(): Word {
        return this._word;
    }

    public set word(word: Word) {
        this._word = word;
    }

    public get gridTools(): GridTools {
        return this._gridTools;
    }

}
