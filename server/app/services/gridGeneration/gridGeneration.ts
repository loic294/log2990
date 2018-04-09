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
    subWord?: boolean;
}

export class Constraint extends Word {
    public constraints?: Array<SubConstraint>;
    public size?: number;

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
    private _wordStack: Array<Constraint>;
    private _wordsFinal: Array<Constraint>;
    private _DEFAULT_SIZE: number = 10;
    private _gridSize: number = this._DEFAULT_SIZE;
    private blackCellCount: number = 0;
    private maxBlackCells: number = 0.3;
    private _definitionCache: Object = {};

    private intersections: Array<Array<number>> = [];

    public constructor() {
        console.time("generation");
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

        // console.log("Fill grid");
        // console.log(this.printGrid());

        return this._grid;
    }

    public hasMinWordSpace(row: number, col: number): boolean {
        const MIN_WORD_LENGTH: number = 2;
        const vertical: boolean = row === 1 || (this._grid[row - MIN_WORD_LENGTH] && !this._grid[row - MIN_WORD_LENGTH][col].isBlack());
        const horizontal: boolean = col === 1 || (this._grid[row][col - MIN_WORD_LENGTH]
            && !this._grid[row][col - MIN_WORD_LENGTH].isBlack());

        return vertical && horizontal;
    }

    public isUniqueCell(row: number, col: number): boolean {
        let count: number = 0;

        if (!this.grid[row - 1] || (this.grid[row - 1][col].isBlack())) {
            count++;
        }

        if (!this.grid[row + 1] || (this.grid[row + 1][col].isBlack())) {
            count++;
        }

        if (!this.grid[row][col - 1] || (this.grid[row - 1][col].isBlack())) {
            count++;
        }

        if (!this.grid[row][col + 1] || (this.grid[row][col + 1].isBlack())) {
            count++;
        }

        return count === 4;
    }

    public fillGridWithBlackCells(): void {
        this.traverseGrid((row: number, col: number) => {
            if (row > 0 && col > 0) {
                if (!this.grid[row][col].isBlack() && (Math.random() < this.maxBlackCells
                    && this.hasMinWordSpace(row, col)) || this.isUniqueCell(row, col)) {
                    this.grid[row][col].setBlack(true);
                    this.blackCellCount += 1;
                }
            }
        });

        if (this.blackCellCount < this.maxBlackCells * (this._gridSize ** 2)) {
            this.fillGridWithBlackCells();
        }

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

        const wordStart: number = word.orientation === Orientation.horizontal ? word.position[1] : word.position[0];

        for (let i: number = wordStart; i < wordStart + word.length; i++) {
            const subConstraint: SubConstraint = cosntraints.find((constraint: SubConstraint) => constraint.point[index] === i);
            // console.log('SUBCONSTRAINT', subConstraint)

            count += 1;
            // console.log("ADD COUNT", count, !!subConstraint, subConstraint && subConstraint.point)

            if (subConstraint !== undefined) {
                const cellChar: string = grid[subConstraint.point[0]][subConstraint.point[1]].char;
                // console.log("CELL CHAR", cellChar)
                if (cellChar !== "◽") {
                    query += count > 1 ? `${count - 1}${cellChar}` : `${cellChar}`;
                    count = 0;
                }
            }

            if (i === word.length - 1 && count > 0) {
                query += `${count}`;
                count = 0;
            }

        }

        if (query.length === 0) {
            return "" + count;
        }

        if (/^[a-z]+$/ig.test(query)) {
            return `${query}${count}`;
        }

        return query;
    }

    public addWordToGrid(grid: Array<Array<Cell>>, word: Constraint): Array<Array<Cell>> {

        let count: number = 0, row: number = word.position[0], col: number = word.position[1];

        do {
            if (word.name[count]) {
                grid[row][col].char = word.name[count];
            }
            word.orientation === Orientation.horizontal ? col += 1 : row += 1;
            count += 1;
        } while (count < word.length);

        // console.log("ADDED", word.name);

        return grid;
    }

    public shouldFindWord(grid: Array<Array<Cell>>, word: Constraint): boolean {

        // console.log(this.printGridWithWord(grid));

        let shouldAddToGrid: boolean = false;

        this.traverseWord(word, (row: number, col: number) => {
            if (grid[row] && grid[row][col] && grid[row][col].char === "◽" && !grid[row][col].isBlack()) {
                // console.log("SHOULD ADD TO GRID", row, col, grid[row][col].char);
                shouldAddToGrid = true;
            }
        });

        return shouldAddToGrid;
    }

    public async checkWordDefinition(query: string): Promise<string> {

        if (this._definitionCache[query]) {
            // console.log("USING CACHE", query);

            return this._definitionCache[query];
        }

        const url: string = `http://localhost:3000/lexical/definition/${query}/easy`;
        const { data: { lexicalResult } }: { data: { lexicalResult: string} } = await axios.get(url);
        // console.log("WORD DEFINITION CHECK", url, lexicalResult);

        this._definitionCache[query] = lexicalResult;

        return lexicalResult;
    }

    public async checkRelatedDefinitions(word: Constraint, grid: Array<Array<Cell>>): Promise<boolean> {
        const lexicalResult: string = await this.checkWordDefinition(word.name);

        if (lexicalResult === "No definitions") {
            return false;
        }

        for (const constraint of word.constraints) {
            // if (constraint.subWord) {
                const subWord: Constraint = this._wordStack[constraint.wordIndex];
                let buildWord: string = "";

                this.traverseWord(subWord, (row: number, col: number) => {
                    buildWord += grid[row][col].char;
                });

                // console.log("SUBOWRD CHECK", buildWord);

                if (/^[a-z]+$/ig.test(buildWord) && subWord && subWord.length > 1) {
                    const result: string = await this.checkWordDefinition(buildWord);

                    if (result === "No definitions") {
                        return false;
                    }
                }
            // }
        }

        return true;
    }

    public async recursion(words: Array<Constraint>, wordIndex: number, cycle: number, grid: Array<Array<Cell>>): Promise<boolean> {

        // console.log('CYCLE', cycle, wordIndex, grid[0][0].char);
        const word: Constraint = words[wordIndex];

        if (cycle > 40 || !word) {
            console.log("CYCLE OUT OF BOUND");
            // this.fillGridWithCells(this._gridSize);
            // this.fillGridWithBlackCells();
            // this.findAllWordsSpaces();
            // await this.recursion(words, 0, 0, this._grid);

            return false;
        }

        // cycle = 0;

        const gridFreeze: Array<Array<Cell>> = [...grid.map((row: Array<Cell>) => ([...row]))];

        if (this.shouldFindWord(grid, word)) {
            const query: string = this.createWordSearchCondition(grid, word);

            let count: number = 0;
            let isValid: boolean = false;
            do {

                let oldResult: string = "";
                do {
                    const url: string = `http://localhost:3000/lexical/wordAndDefinition/${query}/common/easy`;
                    const { data: { lexicalResult } }: { data: { lexicalResult: Array<string>} } = await axios.get(url);

                    // CREATES INFINITE LOOP
                    // if (lexicalResult[1] === "No definitions" || (oldResult === lexicalResult[1] && oldResult !== "undefined")) {
                    //     console.log("FORCE INDEX BACKWARD #1");
                    //     await this.recursion(words, wordIndex - 1, cycle, gridFreeze);

                    //     return false;
                    // }

                    word.name = lexicalResult[0];
                    word.desc = lexicalResult[1];

                    oldResult = word.name;
                } while (word.name === "undefined");

                grid = this.addWordToGrid(gridFreeze, word);

                isValid = await this.checkRelatedDefinitions(word, gridFreeze);

                // console.log("WORD CHECK COUNT", count);
                if (count === 9 && wordIndex > 0) {
                    console.log("FORCE INDEX BACKWARD #2");
                    await this.recursion(words, wordIndex - 1, cycle, gridFreeze)

                    return false;
                } else if (wordIndex === 0) {
                    console.log("END WORD INDEX");
                }

            } while (!isValid && count++ < 10)

        }

        const gridFreeze2: Array<Array<Cell>> = [...gridFreeze.map((row: Array<Cell>) => ([...row]))];

        cycle += 1;
        wordIndex += 1;
        if (await this.recursion(words, wordIndex, cycle, gridFreeze2)) {
            console.log("FORCE INDEX BACKWARD #3");

            if (wordIndex > 0) {
                await this.recursion(words, wordIndex - 1, cycle, gridFreeze);
            }

            return false;
        }

        this._wordsFinal = words;

        return false;

    }

    public startRecursion(words: Array<Constraint>): void {
        this.recursion(words, 0, 0, this._grid).then(() => {
            console.log("Recursion completed");
            console.log(this.printGrid());
            console.log(this.printGridWithWord(this._grid));

            console.log(this._definitionCache);
            console.log(this._wordsFinal);

            console.timeEnd("generation");
        })
        .catch((err: Error) => console.error(err));
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

        return type === "intersecting" ? [point.y, point.x] : [];
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

        // console.log('WORDS WITH CONSTRAINTS', words.map(word => ({ position: word.position, size: word.size, orientation: word.orientation, constraints: word.constraints })));

        // console.log("WITH INTERSECTIONS");
        // console.log(this.printGrid());

        this.filterConstraints(words);
    }

    public setSubConstraintAsSubWord(words: Array<Constraint>, wordIndex: number): Array<Constraint> {
        return words.map((word: Constraint) => {
            word.constraints = word.constraints.map((constraint: SubConstraint) => {
                if (constraint.wordIndex === wordIndex) {
                    constraint.subWord = true;
                }

                return constraint;
            });

            return word;
        });
    }

    public filterConstraints(words: Array<Constraint>): void {

        // console.log("WORDS BEFORE RECUSION", words.length);
        // console.log("WORDS STACK BEFORE RECUSION", this._wordStack.length);
        this._wordStack = [...words];

        // words = words.filter((word: Constraint, filterIndex: number) => {
        //     // console.log("-------------------------------");

        //     let count: number = 0;
        //     this.traverseWord(word, (row: number, col: number) => {
        //         const intersects: boolean = word.constraints.some((constraint: SubConstraint, index: number): boolean => {
        //             // console.log(row, constraint.point[0], col, constraint.point[1]);
        //             const wordIsBigger: boolean = this._wordStack[constraint.wordIndex].size >= word.size
        //                 && !words[filterIndex].constraints[index].subWord;

        //             return row === constraint.point[0] && col === constraint.point[1] && wordIsBigger;
        //         });

        //         // console.log('INSTERSECTS', intersects);
        //         if (intersects) {
        //             count++;
        //         }
        //     });

        //     // console.log("COUNT", count, word.length);
        //     const toKeep: boolean = count !== word.length;
        //     if (!toKeep) {
        //         words = this.setSubConstraintAsSubWord(words, filterIndex);
        //     }

        //     return toKeep;
        // });

        // console.log(this.printGrid());
        // console.log("WORDS AFTER CONSTRAINT", words.length);
        // console.log("WORDS STACK AFTER RECUSION", this._wordStack.length);
        // console.log("WORDS AFTER CONSTRAINT COMPLETE");
        // console.log(words.map((word: Constraint) => ({ position: word.position, size: word.size, orientation: word.orientation })));
        // console.log(words.map((word: Constraint) => word.constraints));

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

        return wordsVertical;
    }

    public siwtchPosition(orientation: Orientation, value1: number, value2: number): Array<number> {
        return Orientation.horizontal ? [value1, value2] : [value2, value1];
    }

    public traverseWord(word: Constraint, fct: Function): void | boolean {
        let count: number = 0, row: number = word.position[0], col: number = word.position[1];

        do {
            const isDefinend: boolean | void = fct(row, col);
            if (isDefinend) {
                return isDefinend;
            }
            word.orientation === Orientation.horizontal ? col += 1 : row += 1;
            count += 1;
        } while (count < word.length);
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
            const t: boolean = this.intersections.some((int: Array<number>) => cell.x === int[0] && cell.y === int[1]);
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
