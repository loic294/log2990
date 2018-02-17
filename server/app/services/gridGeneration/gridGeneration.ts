import { Case } from "../../../../common/grid/case";
import Word, { Orientation } from "../../../../common/lexical/word";
import Constraint from "./constraint";
import axios, { AxiosResponse } from "axios";

export enum Difficulty {
    easy = 0,
    medium = 1,
    hard = 2
}

export default class GridGeneration {
    private _grid: Array<Array<Case>>;
    private _constraintsArray: Array<Constraint> = [];
    private _wordStack: Array<Word>;
    private _DEFAULT_SIZE: number = 10;

    public constructor() { }

    public fillGridWithCases(size: number): Array<Array<Case>> {
        size = size > 0 ? size : this._DEFAULT_SIZE;
        this._grid = [];

        for (let row: number = 0; row < size; row++) {
            this._grid[row] = [];
            for (let col: number = 0; col < size; col++) {
                this._grid[row][col] = new Case("", row, col);
            }
        }

        return this._grid;
    }

    public async placeFirstWords(difficulty: Difficulty): void {
        this._wordStack.push(new Word("", "", [0, 0], Orientation.horizontal, 0, false, this._grid.length));
        const wordAndDescription: Array<string> = await this.getWordAndDefinition(this._wordStack[this._wordStack.length - 1], difficulty);
        this._wordStack[this._wordStack.length - 1].name = wordAndDescription[0];
        this._wordStack[this._wordStack.length - 1].desc = wordAndDescription[1];

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
                commonality = (Math.random() > 0.7 ? "common" : "uncommon");
                level = (Math.random() > 0.7 ? "easy" : "hard"); break;
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
        if (criteria === "10") {
            criteria = "91";
        }

        return criteria;
    }

    public addConstraintForWord(word: Word) {
        for (let wordIndex: number = 0; wordIndex < word.length; wordIndex++) {
            let checkConstraint: boolean = false;
            for (const constraint of this._constraintsArray) {
                if (constraint.checkPositionOfWordHasConstraint(word, wordIndex)) {
                    constraint.addConstrainedWord(word);
                    checkConstraint = true;
                }
            }
            if (!checkConstraint) {
                const position: Array<number> = (word.direction ? [word.row + wordIndex, word.col] : [word.row, word.col + wordIndex]);
                this.constraintsArray.push(new Constraint(word.name[wordIndex], position[0], position[1], [word.name]));
            }
        }
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
}
