import { Cell } from "../../../../common/grid/cell";
import { Orientation } from "../../../../common/lexical/word";
import Constraint, { createConstraints } from "./constraint";
import {traverseWord, switchPosition, sortWords, AxiosResponseData, isNextNotBlack, isNextBlack,
    containtsOnlyLetters, traverseGrid, HashString, HashList, wordRepeats, isValidWord} from "./gridTools";
import { fillGridWithCells, fillGridWithBlackCells } from "./gridInitialisation";
import axios from "axios";
import { List } from "immutable";
import { GRID_SIZE, NORMAL_CELL } from "../../../../common/grid/difficulties";

export const NO_DEFINITION: string = "No definitions";
const MAX_BLACK_CELL: number = 0.3;

export default class GridGeneration {
    private _grid: Array<Array<Cell>>;
    private _wordStack: Array<Constraint>;
    private _wordsFinal: Array<Constraint>;
    private _gridSize: number;
    private _definitionCache: HashString = {};
    private _gridCache: HashList = {};

    public initializeGrid(size: number): void {
        this._gridSize = size !== undefined ? size : GRID_SIZE;
        this._wordStack = [];
        this._definitionCache = {};
        this._gridCache = {};
        this._grid = fillGridWithCells(this._gridSize);
        this._grid = fillGridWithBlackCells(this._grid, MAX_BLACK_CELL, size);
    }

    public fillErrorBlackCase(): void {
        traverseGrid(this._grid, (row: number, col: number) => {
            if (this._grid[row][col].char === NORMAL_CELL) {
                this._grid[row][col].setBlack(true);
            }
        });
    }

    public createWordSearchCondition(grid: List<List<Cell>>, word: Constraint): string {
        let count: number = 0;
        let query: string = "";
        let index: number = 0;
        traverseWord(word, (row: number, col: number) => {
            const cellChar: string = grid.get(row).get(col).char;
            if (cellChar !== NORMAL_CELL) {
                query += count > 0 ? `${count}${cellChar}` : `${cellChar}`;
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
            return count.toString();
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
            if (grid.get(row) && grid.get(row).get(col) && grid.get(row).get(col).char === NORMAL_CELL
            && !grid.get(row).get(col).isBlack()) {
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
        // Note: Axios sends a valid Promise but the linter doesn't detect it. It's a document bug on GitHub.
        // tslint:disable-next-line:await-promise
        const { data: {lexicalResult} }: AxiosResponseData = await axios.get(uri);
        this._definitionCache[query] = lexicalResult;

        return lexicalResult;
    }

    public async checkRelatedDefinitions(definition: string, word: Constraint, grid: List<List<Cell>>): Promise<boolean> {

        for (const constraint of word.constraints) {
            const subWord: Constraint = this._wordStack[constraint.wordIndex];

            if (subWord.invalid) {
                return true;
            }

            let buildWord: string = "";

            traverseWord(subWord, (row: number, col: number) => {
                buildWord += grid.get(row).get(col).char;
            });

            if (buildWord.length === 2) {
                return true;
            }

            if (containtsOnlyLetters(buildWord) && subWord && subWord.length > 1) {
                const result: string = await this.checkWordDefinition(buildWord);

                if (result === NO_DEFINITION) {
                    return false;
                }
            }
        }

        return true;
    }

    public async findWordAndDefinition(
        words: Array<Constraint>,
        wordIndex: number,
        grid: List<List<Cell>>): Promise<List<List<Cell>>> {

        const word: Constraint = words[wordIndex];
        const maxRecursion: number = 3;

        if (this.shouldFindWord(grid, word)) {
            const query: string = this.createWordSearchCondition(grid, word);

            let count: number = 0;
            let isValid: boolean = false;
            do {
                const uri: string = `http://localhost:3000/lexical/wordAndDefinition/${query}/common/easy`;
                // tslint:disable-next-line:await-promise
                const { data: {lexicalResult} }: AxiosResponseData = await axios.get(uri);

                word.name = lexicalResult[0];
                word.desc = lexicalResult[1];
                grid = this.addWordToGrid(grid, word);

                if (lexicalResult[1] !== NO_DEFINITION) {
                    isValid = await this.checkRelatedDefinitions(lexicalResult[1], word, grid);
                }

                if (count === (maxRecursion - 1) && !isValid) {
                    return List();
                }
            } while (!isValid && count++ < maxRecursion);
        }

        return grid;
    }

    public async findAllWords(words: Array<Constraint>, grid: Array<Array<Cell>>): Promise<void> {
        let wordIndex: number = 0;

        this._gridCache[0] = List(grid.map((row: Array<Cell>) => List(row)));

        do {
            const immutableGird: List<List<Cell>> = List(this._gridCache[wordIndex].map((row: List<Cell>) => List(row)));
            this._gridCache[wordIndex] = immutableGird;
            const gridFreeze: List<List<Cell>> = await this.findWordAndDefinition(words, wordIndex, immutableGird);

            if (wordRepeats(words, wordIndex)) {
                this.initializeGrid(this._gridSize);
            }

            const nextGrid: List<List<Cell>> = gridFreeze.size > 0 ? gridFreeze : this._gridCache[wordIndex];
            this._gridCache[wordIndex + 1] = nextGrid;
            this._grid = nextGrid.map((row: List<Cell>) => row.toArray()).toArray();
            this._wordStack[wordIndex].invalid = gridFreeze.size === 0;
            wordIndex++;

        } while (wordIndex > 0 && wordIndex < words.length);

        this.fillErrorBlackCase();
        this._wordsFinal = words.filter((word: Constraint) => isValidWord(word));

    }

    public async startRecursion(): Promise<void> {
        return this.findAllWords(this._wordStack, this._grid).then((): void => {})
        .catch((err: Error) => console.error(err));
    }

    public async findAllWordsSpaces(): Promise<void> {
        const horizontalWords: Array<Constraint> = this.findWordsFromSpace(Orientation.horizontal);
        const verticalWords: Array<Constraint> = this.findWordsFromSpace(Orientation.vertical);

        const allWords: Array<Constraint> = [...horizontalWords, ...verticalWords];
        this._wordStack = await createConstraints(sortWords(allWords));
    }

    public findWordsFromSpace(orientation: Orientation): Array<Constraint> {
        const words: Array<Constraint> = [];
        let word: Constraint = new Constraint("", "", [0, 0], orientation);
        word.invalid = false;
        const gridSize: number = this._gridSize - 1;

        for (let first: number = 0; first < this._gridSize; first++) {
            word.position = switchPosition(orientation, first, 0);
            let w: number = 0;

            while (w < gridSize) {
                let positions: Array<number> = switchPosition(orientation, first, w);

                do {
                    w++;
                    word.length++;
                    positions = switchPosition(orientation, first, w);
                } while (isNextNotBlack(positions, gridSize, this._grid));
                words.push(word);
                while (isNextBlack(positions, gridSize, this._grid)) {
                    w++;
                    positions = switchPosition(orientation, first, w);
                }

                word = new Constraint("", "", switchPosition(orientation, first, w), orientation);
                word.invalid = false;
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
