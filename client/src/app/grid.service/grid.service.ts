import { Injectable } from "@angular/core";
import { Cell } from "../../../../common/grid/cell";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import Word, { Orientation } from "../../../../common/lexical/word";
import { GridTools } from "./grid.tools";

import { WordService } from "../word.service/word.service";
import { SocketService } from "../socket.service/socket.service";
import { GridLoadingService } from "../grid-loading.service/grid-loaing.service";
import { BACK_SPACE_KEY_CODE } from "../constants";

@Injectable()
export class GridService {

    private _grid: Array<Array<Cell>>;
    private _selectedWord: Cell;
    private _word: Word;
    private _otherWord: Word;
    private _gridTools: GridTools;
    private _clues: Array<Word>;

    public constructor(
        private _wordService: WordService,
        private socketService: SocketService,
        private gridLoadingService: GridLoadingService
    ) {

        this._clues = [];
        this._gridTools = new GridTools();
        this.initServicesListeners();
        this.initLoadingServices();
    }

    private initLoadingServices(): void {
        this.gridLoadingService.newGrid.subscribe(
            (grid: Array<String>) => {
                this.initGrid(grid);
            });

        this.gridLoadingService.newClues.subscribe(
            (clues: Array<Word>) => {
                this._clues = clues;
            });
    }

    private initServicesListeners(): void {
        this._wordService.wordFromClue.subscribe(
            (_wordFromClue: Word) => {
                if (_wordFromClue) {
                    this._word = _wordFromClue;
                    this.selectCellFromService(_wordFromClue);
                }
            });

        this.socketService.cellToHighligh.subscribe(
            (data: string) => {
                const { word }: { word: Word } = JSON.parse(data);
                const selectedWord: Word = this._clues.find((w: Word) => word !== null && w.index === word.index);
                this.selectOtherPlayerWord(selectedWord || null);
            });

        this.socketService.wordIsValidated.subscribe(
            (data: string) => {
                const { word }: { word: Word } = JSON.parse(data);
                const selectedWord: Word = this._clues.find((w: Word) => word !== null && w.index === word.index);
                selectedWord.isValidated = true;
                this.applyValidation(selectedWord, true);
            });

    }

    private selectCellFromService(w: Word): void {
        this.selectCells(w);
        this.socketService.syncWord(w);
    }

    public selectOtherPlayerWord(w: Word): void {

        this._gridTools.setGrid(this._grid);

        if (this._otherWord) {
             this._gridTools.iterateWord(this._otherWord, (row: number, col: number) => {
                this._grid[row][col].isOtherPlayer = false;
                this._grid[row][col].startUnselectByOther();
           });
        }

        this._otherWord = w;
        let wordStart: number = 0;
        w.orientation === 0 ? wordStart = w.col : wordStart = w.row;

        if (w) {
            this._gridTools.iterateWord(w, (row: number, col: number, cellTemp: Cell, cell: number) => {
                this._grid[row][col].isOtherPlayer = true;
                if (cell === wordStart) {
                    this._grid[row][col].startSelectByOther();
                }
            });
        }
    }

    public applyValidation(word: Word, isOther: boolean = false): void {
        let tempX: number = word.row;
        let tempY: number = word.col;
        let i: number = 0;

        this.socketService.setWordCount(this.socketService.getWordCount() - 1);

        if (!word) {
            this._gridTools.iterateWord(word, (row: number, col: number) => {
                this._grid[row][col].isOtherPlayer = false;
            });
        }
        while (i < word.length) {
            if (!isOther) {
                this._gridTools.validationByPlayer(this._grid, tempX, tempY);
            }
            if (isOther) {
                this._gridTools.validationByOtherPlayer(this._grid, tempX, tempY);
                this._grid[tempX][tempY].char = word.name[i];
            }
            if (this._grid[tempX][tempY].isValidatedByOther && this._grid[tempX][tempY].validated) {
                this._grid[tempX][tempY].isShared();
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
                    this._grid[row][col].startUnselect();
                }
            });
        }

        if (w != null) {
            this._grid[w.row][w.col].select();
            this.findEndWrittenWord();
            this.wordHighlight();
        }
    }

    public selectCellFromGrid(c: Cell): void {

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

    private wordHighlight(): void {
        this._gridTools.setGrid(this._grid);
        this._gridTools.iterateWord(this._word, (x: number, y: number, cellTemp: Cell, cell: number) => {
            this._grid[cellTemp.x][cellTemp.y].select();

            return cellTemp.char === "-";
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

        if (this.isHorizontal(false) && (c.y !== this._word.col)) {
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
        this.isHorizontal(false) ? wordStart = this._word.col : wordStart = this._word.row;

        this._gridTools.iterateWord(this._word, (x: number, y: number, cellTemp: Cell, cell: number) => {
            this._grid[x][y].unselect();
            this._grid[x][y].startUnselect();
            if (cell === wordStart) {
                this._selectedWord = cellTemp;
                this._grid[x][y].startSelect();
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

    private initGrid(grid: Array<String>): void {
        this._grid = grid.map((row: string) => {
            const strings: Array<string> = row.split(" ");

            return strings.map((c: string) => new Cell(c));
        });

        this._gridTools.iterateGrid(this._grid, (row: number, col: number) => {
            this._grid[row][col].x = row;
            this._grid[row][col].y = col;
            if (this._grid[row][col].char === "_") {
                this._grid[row][col].char = "";
            }

            this._grid[row][col].wordIndexes = this._gridTools.wordsStartAtPosition(row, col, this._clues);
        });

    }

    public wordLength(isOther: boolean): number {
        return isOther ? this._otherWord.length : this._word.length;
    }

    public isHorizontal(isOther: boolean): boolean {
        return isOther ?
                this._otherWord.orientation === Orientation.horizontal
                : this._word.orientation === Orientation.horizontal;
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
