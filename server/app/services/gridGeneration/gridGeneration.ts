import { Cell } from "../../../../common/grid/cell";
import { Orientation } from "../../../../common/lexical/word";
import Constraint from "./constraint";
import {traverseWord, intersects, switchPosition, sortWords,
    containtsOnlyLetters, traverseGrid, HashString, HashNumber, HashCells, HashList} from "./gridTools";
import { fillGridWithCells, fillGridWithBlackCells } from "./gridInitialisation";
import axios from "axios";
import { List } from "immutable";
import { GRID_SIZE, BLACK_CELL } from "../../../../common/grid/difficulties";

const NO_DEFINITION: string = "No definitions";
const MAX_BLACK_CELL: number = 0.3;

export default class GridGeneration {
    private _grid: Array<Array<Cell>>;
    private _wordStack: Array<Constraint>;
    private _wordsFinal: Array<Constraint>;
    private _gridSize: number;
    private _definitionCache: HashString = {};
    private _gridCache: HashList = {};
    private _intersections: Array<Array<number>> = [];

    public initializeGrid(size: number): void {
        this._gridSize = size !== undefined ? size : GRID_SIZE;
        this._wordStack = [];
        this._definitionCache = {};
        this._gridCache = {};
        this._intersections = [];
        this._grid = fillGridWithCells(this._gridSize);
        this._grid = fillGridWithBlackCells(this._grid, MAX_BLACK_CELL, size);
    }

    public fillErrorBlackCase(): void {
        traverseGrid(this._grid, (row: number, col: number) => {
            if (this._grid[row][col].char === BLACK_CELL) {
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
            if (cellChar !== BLACK_CELL) {
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
            if (grid.get(row) && grid.get(row).get(col) && grid.get(row).get(col).char === BLACK_CELL
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
        const { data: {lexicalResult} }: { data: {lexicalResult: string} } = await axios.get(uri);
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
                const { data: {lexicalResult} }: { data: {lexicalResult: Array<string>} } = await axios.get(uri);

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

    public wordRepeats(words: Array<Constraint>, index: number): boolean {
        const wordCount: HashNumber = {};
        for (const word of words) {
            if (wordCount[word.name]++) {
                return true;
            }
        }

        return false;
    }

    public async findAllWords(words: Array<Constraint>, grid: Array<Array<Cell>>): Promise<void> {
        let wordIndex: number = 0;

        do {
            const immutableGird: List<List<Cell>> = List(this._gridCache[wordIndex].map((row: List<Cell>) => List(row)));
            this._gridCache[wordIndex] = immutableGird;
            const gridFreeze: List<List<Cell>> = await this.findWordAndDefinition(words, wordIndex, immutableGird);

            if (this.wordRepeats(words, wordIndex)) {
                this.initializeGrid(this._gridSize);
            }

            const nextGrid: List<List<Cell>> = gridFreeze.size > 0 ? gridFreeze : this._gridCache[wordIndex];
            this._gridCache[wordIndex + 1] = nextGrid;
            this._grid = nextGrid.map((row: List<Cell>) => row.toArray()).toArray();
            this._wordStack[wordIndex].invalid = gridFreeze.size === 0;
            wordIndex++;

        } while (wordIndex < words.length && wordIndex > 0);

        this.fillErrorBlackCase();
        this._wordsFinal = words.filter((word: Constraint) => this.isValidWord(word));

    }

    public isValidWord(word: Constraint): boolean {
        return word.name.length > 0 && word.desc !== NO_DEFINITION;
    }

    public async startRecursion(): Promise<void> {
        return this.findAllWords(this._wordStack, this._grid).then((): void => null)
        .catch((err: Error) => console.error(err));
    }

    public async createConstraints(words: Array<Constraint>): Promise<void> {
        const wordsCount: number = words.length;

        for (let first: number = 0; first < wordsCount; first++) {
            for (let second: number = first; second < wordsCount; second++) {
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
    }

    public async findAllWordsSpaces(): Promise<void> {
        const horizontalWords: Array<Constraint> = this.findWordsFromSpace(Orientation.horizontal);
        const verticalWords: Array<Constraint> = this.findWordsFromSpace(Orientation.vertical);

        const allWords: Array<Constraint> = [...horizontalWords, ...verticalWords];
        await this.createConstraints(sortWords(allWords));
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
                } while (this.isNextNotBlack(positions, gridSize));
                words.push(word);
                while (this.isNextBlack(positions, gridSize)) {
                    w++;
                    positions = switchPosition(orientation, first, w);
                }

                word = new Constraint("", "", switchPosition(orientation, first, w), orientation);
                word.invalid = false;
            }
        }

        return words;
    }

    public isNextNotBlack(positions: Array<number>, gridSize: number): boolean {
        return positions[1] <= gridSize && positions[0] <= gridSize && !this._grid[positions[0]][positions[1]].isBlack();
    }

    public isNextBlack(positions: Array<number>, gridSize: number): boolean {
        return positions[1] <= gridSize && positions[0] <= gridSize && !this._grid[positions[0]][positions[1]].isBlack();
    }

    public get grid(): Cell[][] {
        return this._grid;
    }

    public get words(): Array<Constraint> {
        return this._wordsFinal;
    }
}
