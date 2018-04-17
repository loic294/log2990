import { Injectable } from "@angular/core";
import { Cell } from "../../../../../common/grid/cell";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import Word, { Orientation } from "../../../../../common/lexical/word";
import { GridToolsService} from "./grid.tools.service";
import { WordService } from "../word.service/word.service";
import { SocketService } from "../socket.service/socket.service";
import { BACK_SPACE_KEY_CODE } from "../../constants";
import { GridLoadingService } from "../../grid-loading.service/grid-loading.service";

@Injectable()
export class GridService {

    private _grid: Array<Array<Cell>>;
    private _selectedWord: Cell;
    private _word: Word;
    private _otherWord: Word;
    private _gridTools: GridToolsService;
    private _clues: Array<Word>;

    public constructor(
        private _wordService: WordService,
        private socketService: SocketService,
        private gridLoadingService: GridLoadingService
    ) {
        this._gridTools = new GridToolsService();
        this._clues = [];
        this.initServicesListeners();
        this.initLoadingServices();
    }

    private initLoadingServices(): void {
        this.gridLoadingService.newClues.subscribe(
            (clues: Array<Word>) => {
                this._clues = clues;
            });
        this.gridLoadingService.newGrid.subscribe(
            (grid: Array<Array<Cell>>) => {
                this.initGrid(grid);
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

    private selectCellFromService(word: Word): void {
        this.selectCells(word);
        this.socketService.syncWord(word);
    }

    public selectOtherPlayerWord(word: Word): void {

        this._gridTools.setGrid(this._grid);

        if (this._otherWord) {
             this._gridTools.iterateWord(this._otherWord, (row: number, col: number) => {
                this._grid[row][col].isOtherPlayer = false;
                this._grid[row][col].startUnselectByOther();
           });
        }

        this._otherWord = word;
        let wordStart: number = 0;
        word.orientation === Orientation.horizontal ? wordStart = word.col : wordStart = word.row;

        if (word) {
            this._gridTools.iterateWord(word, (row: number, col: number, cellTemp: Cell, cell: number) => {
                this._grid[row][col].isOtherPlayer = true;
                if (cell === wordStart) {
                    this._grid[row][col].startSelectByOther();
                }
            });
        }
    }

    public applyValidation(word: Word, isOther: boolean = false): void {
        let x: number = word.row;
        let y: number = word.col;
        let i: number = 0;

        this.socketService.setWordCount(this.socketService.getWordCount() - 1);

        if (!word) {
            this._gridTools.iterateWord(word, (row: number, col: number) => {
                this._grid[row][col].isOtherPlayer = false;
            });
        }
        while (i < word.length) {
            if (!isOther) {
                this._gridTools.validationByPlayer(this._grid, x, y);
            }
            if (isOther) {
                this._gridTools.validationByOtherPlayer(this._grid, x, y);
                this._grid[x][y].char = word.name[i];
            }
            if (this._grid[x][y].isValidatedByOther && this._grid[x][y].validated) {
                this._grid[x][y].isShared();
            }
            word.orientation === Orientation.horizontal ? y++ : x++;
            i++;
        }
    }

    private selectCells(word: Word, isMe: boolean = true): void {

        this._gridTools.setGrid(this._grid);

        if (this._selectedWord != null) {
            this._gridTools.iterateGrid(this._grid, (row: number, col: number) => {
                if (this._grid[row][col].selected) {
                    this._grid[row][col].unselect();
                    this._grid[row][col].startUnselect();
                }
            });
        }

        if (word != null) {
            this._grid[word.row][word.col].select();
            this.findEndWrittenWord();
            this.wordHighlight();
        }
    }

    public selectCellFromGrid(cell: Cell): void {

        const tempWord: Word = this.findWordStart(cell.x, cell.y);
        this._wordService.selectWordFromGrid(tempWord);
        this.selectCells(tempWord);

        if (this._word === null) {
            const elem: HTMLElement = document.getElementById(cell.id);
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

    public updateGrid(event: KeyboardEvent, cell: Cell): Observable<Array<Array<Cell>>> {

        if (event.keyCode === BACK_SPACE_KEY_CODE) {
            if (cell.char === "") {
                this.erasePrevious(cell);
            }
            cell.char = "";
            this.findEndWrittenWord();
        }

        if (!this._gridTools.isLetter(String.fromCharCode(event.charCode))) {
            event.preventDefault();
        } else {
            cell.char = (String.fromCharCode(event.charCode));
            this.findEndWrittenWord();
        }

        return of(this._grid);
    }

    private erasePrevious(cell: Cell): void {

        if (this.isHorizontal(false) && (cell.y !== this._word.col)) {
            if (this._grid[cell.x][cell.y - 1].validated) {
                this.erasePrevious(this._grid[cell.x][cell.y - 1]);
            } else {
                this._grid[cell.x][cell.y - 1].char = "";
            }
        } else if (cell.x !== this._word.row) {
            if (this._grid[cell.x - 1][cell.y].validated) {
                this.erasePrevious(this._grid[cell.x - 1][cell.y]);
            } else {
                this._grid[cell.x - 1][cell.y].char = "";
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

    private initGrid(grid: Array<Array<Cell>>): void {
        this._grid = grid.map((row: Array<Cell>) =>
            row.map((cell: Cell) => {
                const newCell: Cell = new Cell(cell.char, cell.x, cell.y);
                newCell.setBlack(cell.black);

                return newCell;
            })
        );

        this._gridTools.iterateGrid(this._grid, (row: number, col: number) => {
            this._grid[row][col].x = row;
            this._grid[row][col].y = col;
            if (!this._grid[row][col].isBlack()) {
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

    public get GridToolsService(): GridToolsService {
        return this._gridTools;
    }
}
