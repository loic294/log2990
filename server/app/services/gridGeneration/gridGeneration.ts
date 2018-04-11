import { Cell } from "../../../../common/grid/case";
import { Orientation } from "../../../../common/lexical/word";
import Constraint from "./constraint";
import { printGrid, printGridWithWord } from "./gridDebuggingTools";
import { traverseWord, intersects, siwtchPosition, sortWords, containtsOnlyLetters } from "./gridTools";
import { fillGridWithCells, fillGridWithBlackCells } from "./gridInitialisation";
import * as request from "request-promise-native";
import { List } from "immutable";
// tslint:disable:no-console

const NO_DEFINITION: string = "No definitions";

export default class GridGeneration {
    private _grid: Array<Array<Cell>>;
    private _wordStack: Array<Constraint>;
    private _wordsFinal: Array<Constraint>;
    private _DEFAULT_SIZE: number = 10;
    private _gridSize: number = this._DEFAULT_SIZE;
    private _maxBlackCells: number = 0.3;
    private _definitionCache: Object = {};
    // private _wordIndexCache: Object = {};
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

    public createWordSearchCondition(grid: List<List<Cell>>, word: Constraint): string {
        let count: number = 0;
        let query: string = "";
        let index: number = 0;
        traverseWord(word, (row: number, col: number) => {
            const cellChar: string = grid.get(row).get(col).char;
            if (cellChar !== "◻️") {
                query += count > 1 ? `${count}${cellChar}` : `${cellChar}`;
                count = 0;
            } else {
                count++;
            }

            if (index++ === word.length - 1 && count > 0) {
                query += `${count}`;
                count = 0;
            }
        });

        if (query.length === 0) {
            return "" + count;
        }

        if (/^[a-z]+$/ig.test(query)) {
            return `${query}${count}`;
        }

        return query;
    }

    public addWordToGrid(grid: List<List<Cell>>, word: Constraint): List<List<Cell>> {

        let count: number = 0;
        traverseWord(word, (row: number, col: number) => {
            if (word.name[count]) {
                const oldCell: Cell = grid.get(row).get(col);
                const newCell: Cell = new Cell(word.name[count], oldCell.x, oldCell.y, null, null, oldCell.isBlack());
                grid = grid.set(row, grid.get(row).set(col, newCell));
            }
            count++;
        });

        return grid;
    }

    public shouldFindWord(grid: List<List<Cell>>, word: Constraint): boolean {

        let shouldAddToGrid: boolean = false;
        traverseWord(word, (row: number, col: number) => {
            if (grid.get(row) && grid.get(row).get(col) && grid.get(row).get(col).char === "◻️" && !grid.get(row).get(col).isBlack()) {
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

    public async checkRelatedDefinitions(definition: string, word: Constraint, grid: List<List<Cell>>): Promise<boolean> {

        for (const constraint of word.constraints) {
            const subWord: Constraint = this._wordStack[constraint.wordIndex];
            let buildWord: string = "";

            traverseWord(subWord, (row: number, col: number) => {
                buildWord += grid.get(row).get(col).char;
            });

            if (buildWord.length === 2) {
                return true;
            }

            const cow: boolean = containtsOnlyLetters(buildWord);
            if (cow && subWord && subWord.length > 1) {
                const result: string = await this.checkWordDefinition(buildWord);

                if (result === NO_DEFINITION) {
                    return false;
                }
            }
        }

        return true;
    }

    // tslint:disable-next-line:max-func-body-length
    public async recursionInternal(
        words: Array<Constraint>,
        wordIndex: number,
        grid: List<List<Cell>>): Promise<List<List<Cell>>> {

        const word: Constraint = words[wordIndex];
        const maxRecursion: number = 10;

        console.log("SHOULD FIND WORD", this.shouldFindWord(grid, word));
        if (this.shouldFindWord(grid, word)) {
            const query: string = this.createWordSearchCondition(grid, word);

            let count: number = 0;
            let isValid: boolean = false;
            do {
                const uri: string = `http://localhost:3000/lexical/wordAndDefinition/${query}/common/easy`;
                const { lexicalResult }: { lexicalResult: Array<string> } = await request({ uri, json: true });

                word.name = lexicalResult[0];
                word.desc = lexicalResult[1];
                grid = this.addWordToGrid(grid, word);

                if (lexicalResult[1] !== NO_DEFINITION) {
                    isValid = await this.checkRelatedDefinitions(lexicalResult[1], word, grid);
                }

                if (count === (maxRecursion - 1) && !isValid) {
                    console.log("NO VALID WORD FOUND");

                    return List();
                }
            } while (!isValid && count++ < maxRecursion);
        }

        return grid;

    }

    // tslint:disable-next-line:max-func-body-length
    public async recursion(words: Array<Constraint>, grid: Array<Array<Cell>>): Promise<void> {
        let wordIndex: number = 0;
        let next: boolean = true;

        this._gridCache[0] = [...grid.map((row: Array<Cell>) => ([...row]))];

        do {

            const prevWord: string = this._wordStack[wordIndex].name;
            const immutableGird: List<List<Cell>> = List(this._gridCache[wordIndex].map((row: Array<Cell>) => List(row)));

            this._gridCache[wordIndex] = immutableGird;
            const gridFreeze: List<List<Cell>> = await this.recursionInternal(words, wordIndex, immutableGird);

            console.log("INDEX", wordIndex);
            console.log("PREV WORD", prevWord);
            console.log("NEW WORD", this._wordStack[wordIndex].name);
            if (gridFreeze.size > 0)
                console.log(printGridWithWord(gridFreeze.map((row: List<Cell>) => row.toArray()).toArray()));
            debugger

            if (prevWord ===  this._wordStack[wordIndex].name || !gridFreeze.size) {
                next = false;
            } else {
                next = true;
                this._gridCache[wordIndex + 1] = gridFreeze;
                // console.log(printGridWithWord(gridFreeze.map((row: List<Cell>) => row.toArray()).toArray()));
            }

            next ? wordIndex++ : wordIndex--;
            this._grid = gridFreeze.map((row: List<Cell>) => row.toArray()).toArray();

        } while (wordIndex < words.length && wordIndex > 0);

        this._wordsFinal = words;

    }

    public startRecursion(words: Array<Constraint>): void {
        this.recursion(words, this._grid).then(() => {
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

    // tslint:disable-next-line:max-func-body-length
    public findWordsFromSpace(orientation: Orientation): Array<Constraint> {
        const words: Array<Constraint> = [];
        let word: Constraint = new Constraint("", "", [0, 0], orientation);
        const GRID_SIZE: number = this._gridSize - 1;

        for (let first: number = 0; first < this._gridSize; first++) {
            word.position = siwtchPosition(orientation, first, 0);
            // word.length = 1;
            let w: number = 0;

            while (w < GRID_SIZE) {
                let positions: Array<number> = siwtchPosition(orientation, first, w);

                do {
                    w++;
                    word.length++;
                    positions = siwtchPosition(orientation, first, w);
                } while (positions[1] <= GRID_SIZE && positions[0] <= GRID_SIZE && !this._grid[positions[0]][positions[1]].isBlack())

                words.push(word);

                while (positions[1] <= GRID_SIZE && positions[0] <= GRID_SIZE && this._grid[positions[0]][positions[1]].isBlack()) {
                    w++;
                    positions = siwtchPosition(orientation, first, w);
                }

                word = new Constraint("", "", siwtchPosition(orientation, first, w), orientation);

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

    public printGrid(): void {
        console.log(printGrid(this._grid, this._intersections))
        console.log(printGridWithWord(this._grid))
    }

}
