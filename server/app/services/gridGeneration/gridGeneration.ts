import { Cell } from "../../../../common/grid/case";
import { Orientation } from "../../../../common/lexical/word";
import Constraint, { SubConstraint } from "./constraint";
import { printGrid, printGridWithWord } from "./gridDebuggingTools";
import { traverseWord, intersects, siwtchPosition, sortWords, sortSubConstraint, containtsOnlyLetters } from "./gridTools";
import { fillGridWithCells, fillGridWithBlackCells } from "./gridInitialisation";
import * as request from "request-promise-native";

const NO_DEFINITION: string = "No definitions";

export default class GridGeneration {
    private _grid: Array<Array<Cell>>;
    private _wordStack: Array<Constraint>;
    private _wordsFinal: Array<Constraint>;
    private _DEFAULT_SIZE: number = 10;
    private _gridSize: number = this._DEFAULT_SIZE;
    private _maxBlackCells: number = 0.3;
    private _definitionCache: Object = {};
    private _wordIndexCache: Object = {};
    private _gridCache: Object = {};

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

    public createWordSearchCondition(grid: Array<Array<Cell>>, word: Constraint): string {
        const index: number = word.orientation === Orientation.horizontal ? 1 : 0;
        const cosntraints: Array<SubConstraint> = sortSubConstraint(word.constraints, index);
        let count: number = 0;
        let query: string = "";
        const wordStart: number = word.orientation === Orientation.horizontal ? word.position[1] : word.position[0];

        for (let i: number = wordStart; i < wordStart + word.length; i++) {
            const subConstraint: SubConstraint = cosntraints.find((constraint: SubConstraint) => constraint.point[index] === i);
            count++;
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

        if (containtsOnlyLetters(query)) {
            return count > 1 ? `${query}${count - 1}` : `${query}`;
        } else if (query.length === 0) {
            return `${count}`;
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

    public async checkRelatedDefinitions(definition: string, word: Constraint, grid: Array<Array<Cell>>): Promise<boolean> {

        for (const constraint of word.constraints) {
            const subWord: Constraint = this._wordStack[constraint.wordIndex];
            let buildWord: string = "";

            traverseWord(subWord, (row: number, col: number) => {
                buildWord += grid[row][col].char;
            });

            if (containtsOnlyLetters(buildWord) && subWord && subWord.length > 1) {
                const result: string = await this.checkWordDefinition(buildWord);

                if (result === NO_DEFINITION) {
                    return false;
                }
            }
        }

        return true;
    }

    public async recursionInternal(
        words: Array<Constraint>,
        wordIndex: number,
        cycle: number,
        grid: Array<Array<Cell>>,
        gridFreeze: Array<Array<Cell>>): Promise<Array<Array<Cell>>> {
            debugger
        const word: Constraint = words[wordIndex];
        const maxRecursion: number = 5;

        if (this.shouldFindWord(grid, word)) {
            const query: string = this.createWordSearchCondition(grid, word);

            let count: number = 0;
            let isValid: boolean = false;
            do {
                const uri: string = `http://localhost:3000/lexical/wordAndDefinition/${query}/common/easy`;
                const { lexicalResult }: { lexicalResult: Array<string> } = await request({ uri, json: true });

                if (lexicalResult[1] !== NO_DEFINITION) {
                    word.name = lexicalResult[0];
                    word.desc = lexicalResult[1];
                    grid = this.addWordToGrid(gridFreeze, word);
                    isValid = await this.checkRelatedDefinitions(lexicalResult[1], word, gridFreeze);
                }

                if (count === (maxRecursion - 1) && !isValid) {
                    debugger
                    console.log("NO VALID WORD FOUND");

                    return [];
                }
            } while (!isValid && count++ < maxRecursion);

            debugger
        }

        return grid;

    }

    // tslint:disable-next-line:max-func-body-length
    public async recursion(words: Array<Constraint>, wordIndex: number, cycle: number, grid: Array<Array<Cell>>): Promise<boolean> {
        debugger

        if(cycle > 40 || wordIndex < 0) {
            console.log("NEW GRID")
            debugger
            // this.initializeGrid(this._gridSize);
            // await this.findAllWordsSpaces();

            return false;
        }

        if (!this._wordIndexCache[wordIndex]) {
            this._wordIndexCache[wordIndex] = 0;
        }
        this._wordIndexCache[wordIndex]++;

        console.log("WORD INDEX", wordIndex, this._wordIndexCache[wordIndex]);
        if (this._wordIndexCache[wordIndex] % 3 === 0) {
            console.log("MAX WORD INDEX REACHED", wordIndex);
            const test: number = Math.floor(this._wordIndexCache[wordIndex] / 2) + 1;
            this._wordIndexCache[wordIndex]++;
            debugger
            await this.recursion(words, wordIndex - test, cycle + 1, this._gridCache[wordIndex - test]);
            debugger

            return false;
        }


        if (wordIndex >= words.length) {
            debugger
            console.log("MAX CYCLE", cycle, wordIndex, words.length)
            return false;
        }
        const gridFreeze0: Array<Array<Cell>> = [...grid.map((row: Array<Cell>) => ([...row]))];
        const gridFreeze: Array<Array<Cell>> = [...grid.map((row: Array<Cell>) => ([...row]))];

        this._gridCache[wordIndex] = gridFreeze0;

        const gridResult: Array<Array<Cell>> = await this.recursionInternal(words, wordIndex, cycle, grid, gridFreeze);
        if (!gridResult.length) {
            console.log("Forced exit of recursion", wordIndex, wordIndex - 1, cycle);
            debugger
            await this.recursion(words, wordIndex - 1, cycle + 1, gridFreeze0);

            debugger
            return false;
        }

        const gridFreeze2: Array<Array<Cell>> = [...gridFreeze.map((row: Array<Cell>) => ([...row]))];
        console.log("Exit normal recursion", wordIndex, wordIndex + 1, cycle);
        await this.recursion(words, wordIndex + 1, cycle + 1, gridFreeze2);

        debugger
        this._wordsFinal = words;

        return false;

    }

    public startRecursion(words: Array<Constraint>): void {
        this.recursion(words, 0, 0, this._grid).then(() => {
            console.log("Recursion completed");
            console.log(printGrid(this._grid, this._intersections));
            console.log(printGridWithWord(this._grid));

            console.log(this._definitionCache);
            // console.log(this._wordsFinal);

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

    public get words(): Array<Constraint> {
        return this._wordsFinal;
    }

}
