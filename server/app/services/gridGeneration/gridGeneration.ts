import { Case } from "../../../../common/grid/case";
import Constraint from "./constraint";

export default class GridGeneration {
    private _grid: Array<Array<Case>>;
    private _DEFAULT_SIZE: number = 10;

    constructor() {}

    public fillGridWithCases(size: number): Array<Array<Case>> {
        size  = size > 0 ? size : this._DEFAULT_SIZE;
        this._grid = [];

        for (let row: number = 0; row < size; row++) {
            this._grid[row] = [];
            for (let col: number = 0; col < size; col++) {
                this._grid[row][col] = new Case("", row, col);
            }
        }

        return this._grid;
    }

    private placeFirstWords

    public get grid(): Case[][] {
        return this._grid;
    }

    public get DEFAULT_SIZE(): number {
        return this._DEFAULT_SIZE;
    }
}
