import { Cell } from "../../../../common/grid/case";
import Word from "../../../../common/lexical/word";
import Constraint from "./constraint";
import axios from "axios";

export enum Difficulty {
    easy = 0,
    medium = 1,
    hard = 2
}

export default class GridGeneration {
    private _grid: Array<Array<Cell>>;
    private _constraintsArray: Array<Constraint>;
    private _wordStack: Array<Word>;
    private _DEFAULT_SIZE: number = 10;
    private RANDOM_GENERATION: number = 0.7;
    private blackCellCount: number = 0;
    private maxBlackCells: number = 0.3;

    public constructor() {
        this._constraintsArray = [];
        this._wordStack = [];
    }

    public fillGridWithCells(size: number): Array<Array<Cell>> {
        size = size !== undefined ? size : this._DEFAULT_SIZE;
        this._grid = [];

        for (let row: number = 0; row < size; row++) {
            this._grid[row] = [];
            for (let col: number = 0; col < size; col++) {
                this._grid[row][col] = new Cell("", row, col);
            }
        }

        return this._grid;
    }

    public fillGridWithBlackCells(): void {
        this.traverseGrid((row: number, col: number) => {
            if (row > 0 && col > 0) {
                if (this.blackCellCount < this.maxBlackCells * this.grid[row].length * this.grid[row].length) {
                    this.grid[row][col].setBlack(true);
                }
            }
        });
    }

    public traverseGrid(fct: Function): void {
        for (let row: number = 0; row < this._grid[0].length; row++) {
            for (let col: number = 0; col < this._grid[0].length; col++) {
                fct(row, col);
            }
        }
    }

    public get printGrid(): void {

    }

    public get grid(): Cell[][] {
        return this._grid;
    }

    public get DEFAULT_SIZE(): number {
        return this._DEFAULT_SIZE;
    }

    public get wordStack(): Array<Word> {
        return this._wordStack;
    }
}
