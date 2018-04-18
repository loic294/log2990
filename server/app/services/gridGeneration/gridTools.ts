import { Cell } from "../../../../common/grid/cell";
import { Orientation } from "../../../../common/lexical/word";
import Constraint, { SubConstraint } from "./constraint";
import { List } from "immutable";
import { NO_DEFINITION } from "./gridGeneration";
export interface HashString {
    [name: string]: string;
}

export interface HashNumber {
    [name: string]: number;
}

export interface HashCells {
    [name: number]: Array<Array<Cell>>;
}

export interface HashList {
    [name: number]: List<List<Cell>>;
}

export interface AxiosResponseData {
    data: {lexicalResult: string};
}

export const isNextNotBlack: (positions: Array<number>, gridSize: number, grid: Array<Array<Cell>>) => boolean
    = (positions: Array<number>, gridSize: number, grid: Array<Array<Cell>>) => {
    return positions[1] <= gridSize && positions[0] <= gridSize && !grid[positions[0]][positions[1]].isBlack();
};

export const isNextBlack: (positions: Array<number>, gridSize: number, grid: Array<Array<Cell>>) => boolean
    = (positions: Array<number>, gridSize: number, grid: Array<Array<Cell>>) => {
    return positions[1] <= gridSize && positions[0] <= gridSize && grid[positions[0]][positions[1]].isBlack();
};

export const isValidWord: (word: Constraint) => boolean = (word: Constraint) => {
    return word.name.length > 0 && word.desc !== NO_DEFINITION;
};

export const containtsOnlyLetters: (query: string) => boolean
    = (query: string): boolean => {

    return /^[a-z]+$/ig.test(query);
};

export const sortSubConstraint: (subconstraints: Array<SubConstraint>, index: number) => Array<SubConstraint>
    = (subconstraints: Array<SubConstraint>, index: number): Array<SubConstraint> => {

    return subconstraints.sort((a: SubConstraint, b: SubConstraint) => {
        if (a.point[index] > b.point[index]) {
            return 1;
        }
        if (a.point[index] > b.point[index]) {
            return 1;
        }

        return 0;
    });
};

export const sortWords: (words: Array<Constraint>) => Array<Constraint>
    = (words: Array<Constraint>): Array<Constraint> => {

    return words
        .filter((word: Constraint) => {
            return word.size > 1;
        })
        .sort((a: Constraint, b: Constraint): number => {
            if (a.size < b.size) {
                return 1;
            }

            if (a.size > b.size) {
                return -1;
            }

            return 0;
        });
};

export const switchPosition: (orientation: Orientation, value1: number, value2: number) => Array<number>
    = (orientation: Orientation, value1: number, value2: number): Array<number> => {
    return orientation === Orientation.horizontal ? [value1, value2] : [value2, value1];
};

export const traverseWord: (word: Constraint, fct: Function) => void | boolean = (word: Constraint, fct: Function): void | boolean => {
    let count: number = 0;
    let row: number = word.position[0];
    let col: number = word.position[1];

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

export const wordRepeats: (words: Array<Constraint>, index: number) => boolean = (words: Array<Constraint>, index: number) => {
    const wordCount: HashNumber = {};
    for (const word of words) {
        if (wordCount[word.name]++ > 0) {
            return true;
        }
    }

    return false;
};
