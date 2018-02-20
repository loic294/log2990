import { Case } from "../../../../common/grid/case";
import Word, { Orientation } from "../../../../common/lexical/word";
import Constraint from "./constraint";
import axios, { AxiosResponse } from "axios";

export enum Difficulty {
    easy = 0,
    medium = 1,
    hard = 2
}

export interface WordQueue {
    word: Word;
    tries?: number;
    childTries?: number;
}

export default class GridGeneration {
    private _grid: Array<Array<Case>>;
    private _constraintsArray: Array<Constraint>;
    private _wordStack: Array<WordQueue>;

    public constructor(
        private _DEFAULT_SIZE: number = 10,
        private RANDOM_GENERATION: number = 0.7) {
        this._constraintsArray = [];
        this._wordStack = [];
    }

    public addWordToGrid(): boolean {

        const POINT: Array<number> = this.generateRandomPoint();
        const WORD_LENGTH: number = 10;
        const DIRECTION: number = this.randomDirection();

        const NEW_WORD = new Word(null, null, POINT, DIRECTION, 0, false, WORD_LENGTH);

        // 1. Generate a word at a given position
            // 1.1 Check that the word is valid in position
                // 1.1.1 Repeat 5 times if not valid
                // 1.1.2 Backtrack if the word still doesn't work and change start position
            // 1.2 If child doesn't work more then 20 times (4 diff random positions), backtrack parent
            // 1.3 Check if less 30% of cells, break

        return true;
    }

    public fillGridWithCases(size: number): Array<Array<Case>> {
        size = size > 0 ? size : this._DEFAULT_SIZE;
        this._grid = [];

        for (let row: number = 0; row < size; row++) {
            this._grid[row] = [];
            for (let col: number = 0; col < size; col++) {
                this._grid[row][col] = new Case("", row, col);
            }
        }

        this.displayGrid();

        return this._grid;
    }

    // Receives a word with length, position, index and direction.
    public async createWord(difficulty: Difficulty, word: Word): Promise<void> {

        do {
            const wordAndDescription: Array<string> = await this.getWordAndDefinition(word, difficulty);
            word.name = wordAndDescription[0];
            word.desc = wordAndDescription[1];
        } while (!this.wordExists(word));

        this._wordStack.push({ word, tries: 0, childTries: 0 });
        this.addConstraintForWord(this._wordStack[this._wordStack.length - 1]);
    }

    private wordExists(word: Word): boolean {
        for (const wordInStack of this._wordStack) {
            if (wordInStack.word.name === word.name) {
                return true;
            }
        }

        return false;
    }

    private async getWordAndDefinition(word: Word, difficulty: Difficulty): Promise<Array<string>> {
        let commonality: string;
        let level: string;
        switch (difficulty) {
            case Difficulty.easy:
                commonality = "common";
                level = "easy"; break;
            case Difficulty.hard:
                commonality = "uncommon";
                level = "hard"; break;
            case Difficulty.medium:
                commonality = (Math.random() > this.RANDOM_GENERATION ? "common" : "uncommon");
                level = (Math.random() > this.RANDOM_GENERATION ? "easy" : "hard"); break;
            default:
                commonality = "InvalidEntry";
        }

        const FETCH_URL: string =
            `http://localhost:3000/lexical/wordAndDefinition/${this.findCriteriaForWord(word)}/${commonality}/${level}`;

        const { data }: { data: Array<string> } = await axios.get(FETCH_URL);

        return data;
    }

    public findCriteriaForWord(word: Word): string {
        let criteria: string = "";
        let nonCriteria: number = 0;
        for (let wordIndex: number = 0; wordIndex < word.length; wordIndex++) {
            let checkConstraint: boolean = false;

            for (const constraint of this._constraintsArray) {
                if (constraint.checkPositionOfWordHasConstraint(word, wordIndex)) {
                    checkConstraint = true;
                    criteria += nonCriteria.toString() + constraint.constraint;
                    nonCriteria = 0;
                }
            }

            if (!checkConstraint) {
                nonCriteria++;
            }
        }

        criteria += nonCriteria.toString();
        // TODO: Remove this hack
        if (criteria === "10") {
            criteria = "91";
        }

        return criteria;
    }

    public addConstraintForWord(word: WordQueue): void {
        for (let wordIndex: number = 0; wordIndex < word.word.length; wordIndex++) {
            let checkConstraint: boolean = false;
            for (const constraint of this._constraintsArray) {
                if (constraint.checkPositionOfWordHasConstraint(word.word, wordIndex)) {
                    constraint.addConstrainedWord(word.word);
                    checkConstraint = true;
                }
            }
            if (!checkConstraint) {
                const position: Array<number> = (
                    word.word.direction ? [word.word.row + wordIndex, word.word.col] : [word.word.row, word.word.col + wordIndex]);
                this.constraintsArray.push(new Constraint(word.word.name[wordIndex], position[0], position[1], [word.word.name]));
            }
        }
    }

    public generatePoint(): number {
        const FACTOR: number = 100;

        return Math.round(Math.random() * FACTOR) % this._DEFAULT_SIZE;
    }

    public generateRandomPoint(): Array<number> {
        return [
            this.generatePoint(),
            this.generatePoint()
        ];
    }

    public randomDirection(): number {
        const FACTOR: number = 10;

        return Math.random() * FACTOR % 1 ? Orientation.horizontal : Orientation.vertical;
    }

    public traverseGrid(size: number, fct: Function): void {
        for (let row: number = 0; row < size; row++) {
            for (let col: number = 0; col < size; col++) {
                fct(row, col);
            }
        }
    }

    public displayGrid(): void {
        const FACTOR: number = 2;
        let gridString: string = "";
        const size: number = this._DEFAULT_SIZE * FACTOR;
        this.traverseGrid(size, (row: number, col: number) => {
            const rowOdd: number = row % 2;
            const colOdd: number = col % 2;

            if (rowOdd) {
                gridString += "-";
            } else if (colOdd) {
                gridString += "|";
            } else {
                gridString += " ";
            }

            if (col === size - 1) {
                gridString += "\n";
            }

        });
        console.log("PRINT GRID");
        console.log(gridString);
    }

    public get grid(): Case[][] {
        return this._grid;
    }

    public get constraintsArray(): Array<Constraint> {
        return this._constraintsArray;
    }
    public set constraintsArray(constraintsArray: Array<Constraint>) {
        this._constraintsArray = constraintsArray;
    }

    public get DEFAULT_SIZE(): number {
        return this._DEFAULT_SIZE;
    }

    public get wordStack(): Array<WordQueue> {
        return this._wordStack;
    }
}
