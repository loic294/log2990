// tslint:disable:no-console no-suspicious-comment max-func-body-length
// TODO: Remove disable!!
import { Cell } from "../../../../common/grid/case";
import Word, { Orientation } from "../../../../common/lexical/word";
// import Constraint from "./constraint";
import axios from "axios";
import {
    checkIntersection
  } from "line-intersect";

export enum Difficulty {
    easy = 0,
    medium = 1,
    hard = 2
}

interface SubConstraint {
    wordIndex: number;
    point: Array<number>;
}

export class Constraint extends Word {
    public constraints: Array<SubConstraint>;
    public size: number;

    constructor(
        public name: string,
        public desc: string,
        public position: Array<number>,
        public orientation: Orientation,
        public index: number = 0,
        public isValidated: boolean = false
    ) {
        super(name, desc, position, orientation, index, isValidated);
        this.constraints = [];
        this.size = name.length;
    }

    public get length(): number {
        return this.size;
    }

    public set length(size: number) {
        this.size = size;
    }

}
export default class GridGeneration {
    private _grid: Array<Array<Cell>>;
    private _wordStack: Array<Word>;
    private _DEFAULT_SIZE: number = 10;
    private _gridSize: number = this._DEFAULT_SIZE;
    private blackCellCount: number = 0;
    private maxBlackCells: number = 0.2;

    private intersections: Array<Array<number>> = [];

    public constructor() {
        this._wordStack = [];
    }

    public fillGridWithCells(size: number): Array<Array<Cell>> {
        size = size !== undefined ? size : this._DEFAULT_SIZE;
        this._grid = [];
        this._gridSize = size;

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

        if (this.blackCellCount < this.maxBlackCells * (this._gridSize ** 2)) {
            this.fillGridWithBlackCells();
        }

        console.log("Fill with black cells");
        console.log(this.printGrid());
    }

    public createWordSearchCondition(grid: Array<Array<Cell>>, word: Constraint): string {

        const index: number = word.orientation === Orientation.horizontal ? 1 : 0;
        const cosntraints: Array<SubConstraint> = word.constraints.sort((a: SubConstraint, b: SubConstraint) => {
            if (a.point[index] > b.point[index]) {
                return 1;
            }
            if (a.point[index] > b.point[index]) {
                return 1;
            }

            return 0;
        });


        let count: number = 0;
        let query: string = "";

        for (let i: number = 0; i < word.length; i++) {
            const subConstraint: SubConstraint = cosntraints.find((constraint: SubConstraint) => constraint.point[index] === i);
            // console.log('SUBCONSTRAINT', subConstraint)

            count += 1;

            if (subConstraint !== undefined) {
                const cellChar: string = grid[subConstraint.point[1]][subConstraint.point[0]].char;
                if (cellChar !== "◽") {
                    query += count > 1 ? `${count}${cellChar}` : `${cellChar}`;
                    count = 0;
                }
            }


            if (i === word.length - 1) {
                query += `${count}`;
            }

        }

        return query;
    }

    public addWordToGrid(grid: Array<Array<Cell>>, word: Constraint): Array<Array<Cell>> {

        let count: number = 0, row: number = word.position[0], col: number = word.position[1];

        do {
            console.log(this.printGridWithWord(grid));
            console.log(row, col, word.orientation);
            grid[row][col].char = word.name[count];
            word.orientation === Orientation.horizontal ? col += 1 : row += 1;
            count += 1;
        } while (count < word.length);

        console.log('ADDED', word.name);
        console.log(this.printGridWithWord(grid));

        return grid;
    }

    public async recursion(words: Array<Constraint>, wordIndex: number, cycle: number, grid: Array<Array<Cell>>): Promise<boolean> {

        console.log('CYCLE', cycle, wordIndex, grid[0][0].char);
        const word: Constraint = words[wordIndex];

        if (cycle > 20 || !word) {
            return false;
        }

        const query: string = this.createWordSearchCondition(grid, word);

        const url: string = `http://localhost:3000/lexical/wordAndDefinition/${query}/common/easy`;
        const { data: { lexicalResult } }: { data: { lexicalResult: Array<string>} } = await axios.get(url);

        word.name = lexicalResult[0];
        word.desc = lexicalResult[1];

        grid = this.addWordToGrid(grid, word);

        const gridFreeze: Array<Array<Cell>> = [...grid];

        cycle += 1;
        wordIndex += 1;
        if (this.recursion(words, wordIndex, cycle, gridFreeze)) {
            return false;
        }

        return false;

    }

    public startRecursion(words: Array<Constraint>): void {
        this.recursion(words, 0, 0, this._grid).then(() => {
            console.log('Recursion completed');
        })
        .catch((err) => console.error(err));
    }

    public intersects(word1: Constraint, word2: Constraint): Array<number> {
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

        return type === "intersecting" ? [point.y, point.x] : []
    }

    public createConstraints(words: Array<Constraint>): void {
        const WORDS_COUNT: number = words.length;

        for (let first: number = 0; first < WORDS_COUNT; first++) {
            for (let second: number = first; second < WORDS_COUNT; second++) {
                const intersection: Array<number> = this.intersects(words[first], words[second]);
                if (intersection.length > 0) {
                    this.intersections.push(intersection);

                    words[first].constraints.push({
                        wordIndex: second,
                        point: intersection
                    });

                    words[second].constraints.push({
                        wordIndex: first,
                        point: intersection
                    });

                }
            }
        }

        console.log('WORDS WITH CONSTRAINTS', words.map(word => ({ position: word.position, size: word.size, orientation: word.orientation, constraints: word.constraints })));

        console.log("WITH INTERSECTIONS");
        console.log(this.printGrid());

        this.startRecursion(words);
    }

    public findAllWordsSpaces(): void {
        const horizontalWords: Array<Constraint> = this.fillWordSpaceHorizontal(Orientation.horizontal);
        const verticalWords: Array<Constraint> = this.fillWordSpaceVertical(Orientation.vertical);

        let allWords: Array<Constraint> = [...horizontalWords, ...verticalWords];
        allWords = allWords
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

        // console.log("ALL WORDS", allWords.map(
        //     (word: Constraint) => ({ position: word.position, size: word.size, orientation: word.orientation }))
        // );

        this.createConstraints(allWords);
    }

    public fillWordSpaceHorizontal(orientation: Orientation): Array<Constraint> {
        const wordsVertical: Array<Constraint> = [];
        let word: Constraint = new Constraint("", "", [0, 0], Orientation.horizontal);

        for (let row: number = 0; row < this._gridSize; row++) {
            word.position = [row, 0];
            for (let col: number = 0; col < this._gridSize; col++) {
                if (!this._grid[row][col].isBlack()) {
                    word.length += 1;
                } else {
                    wordsVertical.push(word);
                    while (col < this._gridSize && this._grid[row][col].isBlack()) {
                        col += 1;
                    }
                    word = new Constraint("", "", [0, 0], Orientation.horizontal);
                    word.position = [row, col];
                    if (this._grid[row][col - 1].isBlack() && col < this._gridSize) {
                        word.length = 1;
                    }
                }

                if (col === this._gridSize - 1) {
                    wordsVertical.push(word);
                    word = new Constraint("", "", [0, 0], Orientation.horizontal);
                }
            }
        }

        // console.log('HORIZONTAL WORD', wordsVertical.map(word => ({ position: word.position, size: word.size, orientation: word.orientation })));

        return wordsVertical;
    }

    public fillWordSpaceVertical(orientation: Orientation): Array<Constraint> {
        const wordsVertical: Array<Constraint> = [];
        let word: Constraint = new Constraint("", "", [0, 0], Orientation.vertical);

        for (let col: number = 0; col < this._gridSize; col++) {
            word.position = [0, col];

            for (let row: number = 0; row < this._gridSize; row++) {
                if (!this._grid[row][col].isBlack()) {
                    word.size += 1;
                } else {
                    wordsVertical.push(word);
                    while (row < this._gridSize && this._grid[row][col].isBlack()) {
                        row += 1;
                    }
                    word = new Constraint("", "", [0, 0], Orientation.vertical);
                    word.position = [row, col];
                    if (this._grid[row - 1][col].isBlack() && row < this._gridSize) {
                        word.length = 1;
                    }
                }

                if (row === this._gridSize - 1) {
                    wordsVertical.push(word);
                    word = new Constraint("", "", [0, 0], Orientation.vertical);
                }
            }
        }

        // console.log('VERTICAL WORD', wordsVertical.map(word => ({ position: word.position, size: word.size, orientation: word.orientation })));

        return wordsVertical;
    }

    public siwtchPosition(orientation: Orientation, value1: number, value2: number): Array<number> {
        return Orientation.horizontal ? [value1, value2] : [value2, value1];
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
            const t: boolean = this.intersections.some((int: Array<number>) => cell.x === int[0] && cell.y === int[1])
            output += cell.isBlack() ? " ❌ " : ` ${t ? "🔵" : cell.char} `;
            if (col === this._grid.length - 1) {
                output += "\n";
            }
        });

        return output;
    }

    public printGridWithWord(grid: Array<Array<Cell>>): String {
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
