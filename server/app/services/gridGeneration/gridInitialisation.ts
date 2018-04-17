import { Cell } from "../../../../common/grid/cell";
import { traverseGrid } from "./gridTools";
import {  NORMAL_CELL } from "../../../../common/grid/difficulties";
const MIN_WORD_LENGTH: number = 2;

export const fillGridWithCells: (size: number) => Array<Array<Cell>> = (size: number): Array<Array<Cell>> => {

    const grid: Array<Array<Cell>> = [];

    for (let row: number = 0; row < size; row++) {
        grid[row] = [];
        for (let col: number = 0; col < size; col++) {
            grid[row][col] = new Cell(NORMAL_CELL, row, col);
        }
    }

    return grid;
};

export const hasMinWordSpace: (grid: Array<Array<Cell>>, row: number, col: number) => boolean
    = (grid: Array<Array<Cell>>, row: number, col: number): boolean => {
    const vertical: boolean = row === 1 || (grid[row - MIN_WORD_LENGTH] && !grid[row - MIN_WORD_LENGTH][col].isBlack());
    const horizontal: boolean = col === 1 || (grid[row][col - MIN_WORD_LENGTH]
        && !grid[row][col - MIN_WORD_LENGTH].isBlack());

    return vertical && horizontal;
};

export const isIsolatedCell: (grid: Array<Array<Cell>>, row: number, col: number) => boolean
    = (grid: Array<Array<Cell>>, row: number, col: number): boolean => {

    const sides: number = 4;

    let count: number = 0;

    if (!grid[row - 1] || (grid[row - 1][col].isBlack())) {
        count++;
    }

    if (!grid[row + 1] || (grid[row + 1][col].isBlack())) {
        count++;
    }

    if (!grid[row][col - 1] || (grid[row - 1][col].isBlack())) {
        count++;
    }

    if (!grid[row][col + 1] || (grid[row][col + 1].isBlack())) {
        count++;
    }

    return count === sides;
};

export const fillGridWithBlackCells: (grid: Array<Array<Cell>>, maxBlackCells: number, size: number) => Array<Array<Cell>>
    = (grid: Array<Array<Cell>>, maxBlackCells: number, size: number): Array<Array<Cell>> => {

    let blackCellCount: number = 0;

    do {

        traverseGrid(grid, (row: number, col: number) => {
            if (row > 0 && col > 0) {
                const random: boolean = Math.random() < maxBlackCells && hasMinWordSpace(grid, row, col);
                if (!grid[row][col].isBlack() && random || isIsolatedCell(grid, row, col)) {
                    grid[row][col].setBlack(true);
                    blackCellCount += 1;
                }
            }
        });

    } while (blackCellCount < maxBlackCells * (size ** 2));

    return grid;

};
