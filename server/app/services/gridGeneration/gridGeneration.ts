import { Case } from "../../../../common/grid/case";
import Word from "../../../../common/lexical/word";
import Constraint from "./constraint";

export default class GridGeneration {
    private _grid: Array<Array<Case>>;
    private _constraintsArray: Array<Constraint>;
    private _wordStack: Array<Word>;
    private _DEFAULT_SIZE: number = 10;

    public constructor() {}

    public fillGridWithCases(size: number): Array<Array<Case>> {
        size  = size > 0 ? size : this._DEFAULT_SIZE;
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
/*
    private async getWord(word: Word, difficulty: string) {
        let commonality: string = "";

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
            const response: AxiosResponse < any > = await axios.get(FETCH_URL);

            return response.data;
        } catch (err) {
            throw (err);
        }
    }
    */

    public get grid(): Case[][] {
        return this._grid;
    }

    public get DEFAULT_SIZE(): number {
        return this._DEFAULT_SIZE;
    }
}
