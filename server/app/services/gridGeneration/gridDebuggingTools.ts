import { Cell } from "../../../../common/grid/case";

export const printGrid: (grid: Array<Array<Cell>>, intersections: Array<Array<number>>) => String = () => {
    let output: string = "";
    this.traverseGrid((row: number, col: number) => {
        const cell: Cell = this._grid[row][col];
        const t: boolean = this.intersections.some((int: Array<number>) => cell.x === int[0] && cell.y === int[1]);
        output += cell.isBlack() ? " ❌ " : ` ${t ? "🔵" : cell.char} `;
        if (col === this._grid.length - 1) {
            output += "\n";
        }
    });

    return output;
};

export const printGridWithWord: (grid: Array<Array<Cell>>) => String = (grid: Array<Array<Cell>>) => {
    let output: string = "";
    for (let row: number = 0; row < this.grid[0].length; row++) {
        for (let col: number = 0; col < this.grid[0].length; col++) {
            const cell: Cell = this.grid[row][col];
            output += cell.isBlack() ? " ❌ " : ` ${cell.char} `;
            if (col === this.grid.length - 1) {
                output += "\n";
            }
        }
    }

    return output;
};