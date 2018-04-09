import { Cell } from "../../../../common/grid/case";
import Word, { Orientation } from "../../../../common/lexical/word";
import Constraint, { SubConstraint } from "./constraint";
import { printGrid, printGridWithWord } from "./gridDebuggingTools";
import { traverseWord, intersects, siwtchPosition, sortWords, sortSubConstraint } from "./gridTools";
import { fillGridWithCells, fillGridWithBlackCells } from "./gridInitialisation"
import * as request from "request-promise-native";

export default class GridGeneration {
    private _grid: Array<Array<Cell>>;
    private _wordStack: Array<Constraint>;
    private _wordsFinal: Array<Constraint>;
    private _DEFAULT_SIZE: number = 10;
    private _gridSize: number = this._DEFAULT_SIZE;
    private _maxBlackCells: number = 0.3;
    private _definitionCache: Object = {};

    private _intersections: Array<Array<number>> = [];

    public constructor() {
        console.time("generation");
        this._wordStack = [];
    }

    public initializeGrid(size: number): void {
        this._gridSize = size !== undefined ? size : this._DEFAULT_SIZE;
        this._grid = fillGridWithCells(this._gridSize);
        this._grid = fillGridWithBlackCells(this._grid, this._maxBlackCells, size);
    }

    // tslint:disable-next-line:max-func-body-length
    public createWordSearchCondition(grid: Array<Array<Cell>>, word: Constraint): string {

        const index: number = word.orientation === Orientation.horizontal ? 1 : 0;
        const cosntraints: Array<SubConstraint> = sortSubConstraint(word.constraints, index);

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

    // tslint:disable-next-line:max-func-body-length
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

                if (this._grid[positions[0]][positions[1]].isBlack()) {
                    words.push(word);
                    while (second < this._gridSize && this._grid[positions[0]][positions[1]].isBlack()) {
                        second += 1;
                        positions = siwtchPosition(orientation, first, second);
                    }
                    word = new Constraint("", "", siwtchPosition(orientation, first, second), orientation);
                }
                word.length++;

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
