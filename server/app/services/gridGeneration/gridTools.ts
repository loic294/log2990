// tslint:disable:no-console no-suspicious-comment max-func-body-length
// TODO: Remove disable!!
import { Cell } from "../../../../common/grid/cell";
import { Orientation } from "../../../../common/lexical/word";
import Constraint, { SubConstraint } from "./constraint";
import { checkIntersection } from "line-intersect";

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

export const siwtchPosition: (orientation: Orientation, value1: number, value2: number) => Array<number>
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
