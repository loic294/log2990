// tslint:disable:no-console no-suspicious-comment max-func-body-length
// TODO: Remove disable!!
import { Cell } from "../../../../common/grid/case";
import { Orientation } from "../../../../common/lexical/word";
import Constraint from "./constraint";
import { checkIntersection } from "line-intersect";

//   public static fillGridWithCells(size: number): Array<Array<Cell>> {
//     size = size !== undefined ? size : this._DEFAULT_SIZE;
//     this._grid = [];
//     this._gridSize = size;

//     for (let row: number = 0; row < size; row++) {
//         this._grid[row] = [];
//         for (let col: number = 0; col < size; col++) {
//             this._grid[row][col] = new Cell("◽", row, col);
//         }
//     }

//     return this._grid;
// }

// public hasMinWordSpace(row: number, col: number): boolean {
//     const MIN_WORD_LENGTH: number = 2;
//     const vertical: boolean = row === 1 || (this._grid[row - MIN_WORD_LENGTH] && !this._grid[row - MIN_WORD_LENGTH][col].isBlack());
//     const horizontal: boolean = col === 1 || (this._grid[row][col - MIN_WORD_LENGTH]
//         && !this._grid[row][col - MIN_WORD_LENGTH].isBlack());

//     return vertical && horizontal;
// }

// public isUniqueCell(row: number, col: number): boolean {
//     let count: number = 0;

//     if (!this.grid[row - 1] || (this.grid[row - 1][col].isBlack())) {
//         count++;
//     }

//     if (!this.grid[row + 1] || (this.grid[row + 1][col].isBlack())) {
//         count++;
//     }

//     if (!this.grid[row][col - 1] || (this.grid[row - 1][col].isBlack())) {
//         count++;
//     }

//     if (!this.grid[row][col + 1] || (this.grid[row][col + 1].isBlack())) {
//         count++;
//     }

//     return count === 4;
// }

// public fillGridWithBlackCells(): void {
//     this.traverseGrid((row: number, col: number) => {
//         if (row > 0 && col > 0) {
//             if (!this.grid[row][col].isBlack() && (Math.random() < this.maxBlackCells
//                 && this.hasMinWordSpace(row, col)) || this.isUniqueCell(row, col)) {
//                 this.grid[row][col].setBlack(true);
//                 this.blackCellCount += 1;
//             }
//         }
//     });

//     if (this.blackCellCount < this.maxBlackCells * (this._gridSize ** 2)) {
//         this.fillGridWithBlackCells();
//     }

// }

export const intersects: (word1: Constraint, word2: Constraint) => Array<number>
    = (word1: Constraint, word2: Constraint): Array<number> => {

    if (word1.orientation === word2.orientation) {
        return [];
    }

    const { point, type }: { point: { x: number, y: number }, type: string } = checkIntersection(
        word1.position[1],
        word1.position[0],
        word1.orientation === Orientation.horizontal ? word1.position[1] + word1.length : word1.position[1],
        word1.orientation === Orientation.vertical ? word1.position[0] + word1.length : word1.position[0],
        word2.position[1],
        word2.position[0],
        word2.orientation === Orientation.horizontal ? word2.position[1] + word2.length : word2.position[1],
        word2.orientation === Orientation.vertical ? word2.position[0] + word2.length : word2.position[0],
    );

    return type === "intersecting" ? [point.y, point.x] : [];
};

// public siwtchPosition(orientation: Orientation, value1: number, value2: number): Array<number> {
//     return Orientation.horizontal ? [value1, value2] : [value2, value1];
// }

export const traverseWord: (word: Constraint, fct: Function) => void | boolean = (word: Constraint, fct: Function): void | boolean => {
    let count: number = 0, row: number = word.position[0], col: number = word.position[1];

    do {
        const isDefinend: boolean | void = fct(row, col);
        if (isDefinend) {
            return isDefinend;
        }
        word.orientation === Orientation.horizontal ? col += 1 : row += 1;
        count += 1;
    } while (count < word.length);
};

export const traverseGrid: (grid: Array<Array<Cell>>, fct: Function) => void = (grid: Array<Array<Cell>>, fct: Function) => {
    if (grid[0]) {
        for (let row: number = 0; row < grid[0].length; row++) {
            for (let col: number = 0; col < grid[0].length; col++) {
                fct(row, col);
            }
        }
    }
};
