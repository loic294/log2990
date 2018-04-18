import { Injectable } from "@angular/core";
import { Cell } from "../../../../../common/grid/cell";
import Word, { Orientation } from "../../../../../common/lexical/word";

@Injectable()
export class GridToolsService {

    private _row: number;
    private _col: number;
    private _grid: Array<Array<Cell>>;

    public iterateGrid(grid: Array<Array<Cell>>, fct: Function): void {
        for (let i: number = 0; i < grid.length; i++) {
            for (let j: number = 0; j < grid[i].length; j++) {
                fct(i, j);
            }
        }
    }

    public iterateWord(word: Word, fct: Function): void {
        const start: number = word.orientation === Orientation.horizontal ? word.col : word.row;
        for (let cell: number = start; cell < start + word.length; cell++) {
            const cellTemp: Cell = word.orientation === Orientation.horizontal ? this._grid[word.row][cell] : this._grid[cell][word.col];

            if (fct(cellTemp.x, cellTemp.y, cellTemp, cell, stop)) {
                break;
            }
        }
    }

    public wordsStartAtPosition(row: number, col: number, clues: Array<Word>): Array<number> {
        return clues.filter((word: Word): boolean => word.position[0] === row && word.position[1] === col)
            .map((word: Word): number => word.index + 1);
    }

    public isBlack(letter: string): boolean {
        return (/\-/.test(letter) && letter.length === 1);
    }

    public setPosition(row: number, col: number): void {
        this._row = row;
        this._col = col;
    }

    public setGrid(grid: Array<Array<Cell>>): void {
        this._grid = grid;
    }

    public findWordStart(forceVertical: boolean): Word {
        let tempOrientation: Orientation;
        if (!this.isBlack(this._grid[this._row][this._col].char)) {
            if ((this.previousHorizontalIsNotBlack() || this.nextHorizontalIsNotBlack()) && !forceVertical) {

                this.findHorizontalWordStart();
                tempOrientation = Orientation.horizontal;
            } else {
                this.findVerticalWordStart();
                tempOrientation = Orientation.vertical;
            }
        }

        return new Word("", "", [this._row, this._col], tempOrientation, 0, false);
    }

    public findHorizontalWordStart(): void {
        while (this.previousHorizontalIsNotBlack()) {
            this._col--;
        }
    }

    public findVerticalWordStart(): void {
        while (this.previousVerticalIsNotBlack()) {
            this._row--;
        }
    }

    public previousHorizontalIsNotBlack(): boolean {
        return (this._col - 1 >= 0 && !this.isBlack(this._grid[this._row][this._col - 1].char));
    }

    public nextHorizontalIsNotBlack(): boolean {
        return (this._col + 1 < this._grid[this._row].length && !this.isBlack(this._grid[this._row][this._col + 1].char));
    }

    public previousVerticalIsNotBlack(): boolean {
        return (this._row - 1 >= 0 && !this.isBlack(this._grid[this._row - 1][this._col].char));
    }

    public isLetter(element: string): boolean {
        const constraint: RegExp = /^[a-z]+$/i;

        return constraint.test(element);
    }

    public validationByOtherPlayer(grid: Array<Array<Cell>>, tempX: number, tempY: number): void {
        grid[tempX][tempY].isOtherPlayer = true;
        grid[tempX][tempY].validateOther();
        grid[tempX][tempY].startUnselect();
        grid[tempX][tempY].startUnselectByOther();
    }

    public validationByPlayer(grid: Array<Array<Cell>>, tempX: number, tempY: number): void {
        grid[tempX][tempY].validate();
        grid[tempX][tempY].startUnselect();
        grid[tempX][tempY].startUnselectByOther();
    }

}
