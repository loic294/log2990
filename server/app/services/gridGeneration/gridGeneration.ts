// tslint:disable:no-console no-suspicious-comment
// TODO: Remove disable!!
import { Cell } from "../../../../common/grid/case";
import Word from "../../../../common/lexical/word";
// import Constraint from "./constraint";

export enum Difficulty {
    easy = 0,
    medium = 1,
    hard = 2
}

export default class GridGeneration {
    private _grid: Array<Array<Cell>>;
    // private _constraintsArray: Array<Constraint>;
    private _wordStack: Array<Word>;
    private _DEFAULT_SIZE: number = 10;
    // private RANDOM_GENERATION: number = 0.7;
    private blackCellCount: number = 0;
    private maxBlackCells: number = 0.2;

    public constructor() {
        // this._constraintsArray = [];
        this._wordStack = [];
    }

    public fillGridWithCells(size: number): Array<Array<Cell>> {
        size = size !== undefined ? size : this._DEFAULT_SIZE;
        this._grid = [];

        for (let row: number = 0; row < size; row++) {
            this._grid[row] = [];
            for (let col: number = 0; col < size; col++) {
                this._grid[row][col] = new Cell("◽", row, col);
            }
        }

        console.log("Fill grid");
        console.log(this.printGrid());

        return this._grid;
    }

    public hasMinWordSpace(row: number, col: number): boolean {
        const MIN_WORD_LENGTH: number = 2;
        const vertical: boolean = row === 1 || (this._grid[row - MIN_WORD_LENGTH] && !this._grid[row - MIN_WORD_LENGTH][col].isBlack());
        const horizontal: boolean = col === 1 || (this._grid[row][col - MIN_WORD_LENGTH]
            && !this._grid[row][col - MIN_WORD_LENGTH].isBlack());

        return vertical && horizontal;
    }

    public fillGridWithBlackCells(): void {
        this.traverseGrid((row: number, col: number) => {
            if (row > 0 && col > 0) {
                if (!this.grid[row][col].isBlack() && Math.random() < this.maxBlackCells && this.hasMinWordSpace(row, col)) {
                    this.grid[row][col].setBlack(true);
                    this.blackCellCount += 1;
                }
            }
        });

        if (this.blackCellCount < this.maxBlackCells * (this._DEFAULT_SIZE ** 2)) {
            this.fillGridWithBlackCells();
        }

        console.log("Fill with black cells");
        console.log(this.printGrid());
    }

    public traverseGrid(fct: Function): void {
        if (this._grid[0]) {
            for (let row: number = 0; row < this._grid[0].length; row++) {
                for (let col: number = 0; col < this._grid[0].length; col++) {
                    fct(row, col);
                }
            }
        }
    }

    public printGrid(): String {
        let output: string = "";
        this.traverseGrid((row: number, col: number) => {
            const cell: Cell = this._grid[row][col];
            output += cell.isBlack() ? " ❌ " : ` ${cell.char} `;
            if (col === this._grid.length - 1) {
                output += "\n";
            }
        });

        return output;
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
