/**
 * Note
 * Ces outils sont uniquement utilisés pour débogguer la génération de grille et
 * offrir une version visuelle de la grille.
 * **/
import { Cell } from "../../../../common/grid/cell";
import { traverseGrid } from "./gridTools";

export const printGrid: (grid: Array<Array<Cell>>, intersections: Array<Array<number>>) => String
    = (grid: Array<Array<Cell>>, intersections: Array<Array<number>>) => {
    let output: string = "";
    traverseGrid(grid, (row: number, col: number): void => {
        const cell: Cell = grid[row][col];
        const t: boolean = intersections.some((int: Array<number>) => cell.x === int[0] && cell.y === int[1]);
        output += cell.isBlack() ? " ❌ " : ` ${t ? "🔵" : cell.char} `;
        if (col === grid.length - 1) {
            output += "\n";
        }
    });

    return output;
};

export const printGridWithWord: (grid: Array<Array<Cell>>) => String = (grid: Array<Array<Cell>>) => {
    let output: string = "";
    for (let row: number = 0; row < grid[0].length; row++) {
        for (let col: number = 0; col < grid[0].length; col++) {
            const cell: Cell = grid[row][col];
            output += cell.isBlack() ? " ❌ " : ` ${cell.char} `;
            if (col === grid.length - 1) {
                output += "\n";
            }
        }
    }

    return output;
};
