// tslint:disable:no-console no-suspicious-comment max-func-body-length
// TODO: Remove disable!!
import { Cell } from "../../../../common/grid/case";
import Word, { Orientation } from "../../../../common/lexical/word";
import Constraint, { SubConstraint } from "./constraint";
import { printGrid, printGridWithWord } from "./gridDebuggingTools";
import { traverseGrid, traverseWord, intersects, siwtchPosition, sortWords } from "./gridTools";
import * as request from "request-promise-native";

export enum Difficulty {
    easy = 0,
    medium = 1,
    hard = 2
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

    private _intersections: Array<Array<number>> = [];

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
        traverseGrid(this._grid, (row: number, col: number) => {
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

            count += 1;
            if (subConstraint !== undefined) {
                const cellChar: string = grid[subConstraint.point[0]][subConstraint.point[1]].char;
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

        let count: number = 0;

        traverseWord(word, (row: number, col: number) => {
            if (word.name[count]) {
                grid[row][col].char = word.name[count];
            }
            count++;
        });

        return grid;
    }

    public shouldFindWord(grid: Array<Array<Cell>>, word: Constraint): boolean {

        let shouldAddToGrid: boolean = false;

        traverseWord(word, (row: number, col: number) => {
            if (grid[row] && grid[row][col] && grid[row][col].char === "◽" && !grid[row][col].isBlack()) {
                shouldAddToGrid = true;
            }
        });

        return shouldAddToGrid;
    }

    public async checkWordDefinition(query: string): Promise<string> {

        if (this._definitionCache[query]) {
            return this._definitionCache[query];
        }

        const uri: string = `http://localhost:3000/lexical/definition/${query}/easy`;
        const { lexicalResult }: { lexicalResult: string } = await request({ uri, json: true });

        this._definitionCache[query] = lexicalResult;

        return lexicalResult;
    }

    public async checkRelatedDefinitions(word: Constraint, grid: Array<Array<Cell>>): Promise<boolean> {
        const lexicalResult: string = await this.checkWordDefinition(word.name);

        if (lexicalResult === "No definitions") {
            return false;
        }

        for (const constraint of word.constraints) {
            const subWord: Constraint = this._wordStack[constraint.wordIndex];
            let buildWord: string = "";

            traverseWord(subWord, (row: number, col: number) => {
                buildWord += grid[row][col].char;
            });

            if (/^[a-z]+$/ig.test(buildWord) && subWord && subWord.length > 1) {
                const result: string = await this.checkWordDefinition(buildWord);

                if (result === "No definitions") {
                    return false;
                }
            }
        }

        return true;
    }

    public async recursion(words: Array<Constraint>, wordIndex: number, cycle: number, grid: Array<Array<Cell>>): Promise<boolean> {

        const word: Constraint = words[wordIndex];

        if (cycle > 40 || !word) {
            console.log("CYCLE OUT OF BOUND");

            return false;
        }

        const gridFreeze: Array<Array<Cell>> = [...grid.map((row: Array<Cell>) => ([...row]))];

        if (this.shouldFindWord(grid, word)) {
            const query: string = this.createWordSearchCondition(grid, word);

            let count: number = 0;
            let isValid: boolean = false;
            do {

                let oldResult: string = "";
                do {
                    const uri: string = `http://localhost:3000/lexical/wordAndDefinition/${query}/common/easy`;
                    const { lexicalResult }: { lexicalResult: Array<string> } = await request({ uri, json: true });

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
            console.log(printGrid(this._grid, this._intersections));
            console.log(printGridWithWord(this._grid));

            console.log(this._definitionCache);
            console.log(this._wordsFinal);

            console.timeEnd("generation");
        })
        .catch((err: Error) => console.error(err));
    }

    public createConstraints(words: Array<Constraint>): void {
        const WORDS_COUNT: number = words.length;

        for (let first: number = 0; first < WORDS_COUNT; first++) {
            for (let second: number = first; second < WORDS_COUNT; second++) {
                const intersection: Array<number> = intersects(words[first], words[second]);
                if (intersection.length > 0) {
                    this._intersections.push(intersection);

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

        this._wordStack = [...words];
        this.startRecursion(words);
    }

    public findAllWordsSpaces(): void {
        const horizontalWords: Array<Constraint> = this.findWordsFromSpace(Orientation.horizontal);
        const verticalWords: Array<Constraint> = this.findWordsFromSpace(Orientation.vertical);

        const allWords: Array<Constraint> = [...horizontalWords, ...verticalWords];
        this.createConstraints(sortWords(allWords));
    }

    public findWordsFromSpace(orientation: Orientation): Array<Constraint> {
        const words: Array<Constraint> = [];
        let word: Constraint = new Constraint("", "", [0, 0], orientation);

        for (let first: number = 0; first < this._gridSize; first++) {
            word.position = siwtchPosition(orientation, first, 0);

            for (let second: number = 0; second < this._gridSize; second++) {
                let positions: Array<number> = siwtchPosition(orientation, first, second);

                if (!this._grid[positions[0]][positions[1]].isBlack()) {
                    word.length += 1;
                } else {
                    words.push(word);
                    while (second < this._gridSize && this._grid[positions[0]][positions[1]].isBlack()) {
                        second += 1;
                        positions = siwtchPosition(orientation, first, second);
                    }
                    word = new Constraint("", "", [0, 0], orientation);
                    word.position = siwtchPosition(orientation, first, second);

                    const positions2: Array<number> = siwtchPosition(orientation, first, second - 1);
                    if (this._grid[positions2[0]][positions2[1]].isBlack() && second < this._gridSize) {
                        word.length = 1;
                    }
                }

                if (second === this._gridSize - 1) {
                    words.push(word);
                    word = new Constraint("", "", [0, 0], orientation);
                }
            }
        }

        return words;
    }

    public get grid(): Cell[][] {
        return this._grid;
    }

    public get wordStack(): Array<Word> {
        return this._wordStack;
    }
}
