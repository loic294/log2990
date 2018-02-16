import { Case } from "../../../../common/grid/case";
import Word from "../../../../common/lexical/word";
import Constraint from "./constraint";

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

    //public placeFirstWords(): void { }

    private async getWord(word: Word, difficulty: Difficulty){

        let commonality: string;
        let level: string;
        switch (difficulty){
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

        const FETCH_URL: string = `http://localhost:3000/lexical/wordAndDefinition/${this.findCriteriaForWord(word)}/${commonality}/${level}`;

        //const response: AxiosResponse<any> = await axios.get(FETCH_URL);
    }

    /*
    private async getWord(word: Word, difficulty: string) {
        

        switch (difficulty) {
            case "easy":
                commonality = "common"; break;
            case "hard":
                commonality = "uncommon"; break;
            case "normal":
                commonality = (Math.random() > 0.7 ? "common" : "uncommon"); break;
            default:
                commonality = "InvalidEntry";
        }

        const FETCH_URL: string = `http://localhost:3000/lexical/wordsearch/${commonality}/${}`;
        try {
            const response: AxiosResponse<any> = await axios.get(FETCH_URL);

            return response.data;
        } catch (err) {
            throw (err);
        }
    }
    */

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
