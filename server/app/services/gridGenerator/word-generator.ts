import { Case } from "../../../../common/grid/case";
import GridGenerator from "./grid-generator";
import Word, { Orientation } from "../../../../common/lexical/word";
import Constraint from "./constraint";
import axios, { AxiosResponse } from "axios";

interface LexicalWord {
    lexicalResult: string;
}

export default class WordGenerator extends GridGenerator {

    private horizontalWordLength: number[] = [];
    private verticalWordLength: number[] = [];
    private _horizontalWordArray: Word[] = [];
    private _verticalWordArray: Word[] = [];
    private _constraintsArray: Constraint[] = [];
    private _wordArray: Word[] = [];

    constructor() {
        super();
        this.addPositionToGrid();
        this.findHorizontalWordLength();
        this.findVerticalWordLength();
        this.initialiseHorizontalWordArray();
        this.initialiseVerticalWordArray();
    }

    private addPositionToGrid(): void {
        for (let rows: number = 0; rows < this.getGrid().length; rows++) {
            for (let col: number = 0; col < this.getGrid().length; col++) {
                this.getGrid()[rows][col].x = rows;
                this.getGrid()[rows][col].y = col;
            }
        }
    }

    public testWordLength(grid: Case[][]): void {
        const temp: Case[][] = this.getGrid();
        this.setGrid(grid);
        this.findVerticalWordLength();
        this.findHorizontalWordLength();
        this.setGrid(temp);
    }

    private findHorizontalWordLength(): void {
        this.horizontalWordLength = [];
        let latestBlackPosition: number = 0;
        let wordIndex: number = 0;
        let blackOnLine: boolean = false;

        for (let rows: number = 0; rows < this.getGrid().length; rows++) {
            latestBlackPosition = 0;
            blackOnLine = false;
            for (let col: number = 0; col < this.getGrid().length; col++) {
                if (col === this.getGrid().length - 1) {
                    if (this.getGrid()[rows][col].isBlack()) {
                        this.horizontalWordLength[wordIndex] = col - latestBlackPosition;
                    } else {
                        this.horizontalWordLength[wordIndex] = (blackOnLine ? col - latestBlackPosition : col + 1);
                    }
                    wordIndex++;
                } else if (this.getGrid()[rows][col].isBlack()) {
                    this.horizontalWordLength[wordIndex] = col - latestBlackPosition;
                    latestBlackPosition = col;
                    wordIndex++;
                    blackOnLine = true;
                }
            }
        }
    }

    private findVerticalWordLength(): void {
        this.verticalWordLength = [];
        let latestBlackPosition: number = 0;
        let wordIndex: number = 0;
        let blackOnLine: boolean = false;
        for (let col: number = 0; col < this.getGrid().length; col++) {
            latestBlackPosition = 0;
            blackOnLine = false;
            for (let rows: number = 0; rows < this.getGrid().length; rows++) {
                if (rows === this.getGrid().length - 1) {
                    if (this.getGrid()[rows][col].isBlack()) {
                        this.verticalWordLength[wordIndex] = rows - latestBlackPosition;
                    } else {
                        this.verticalWordLength[wordIndex] = (blackOnLine ? rows - latestBlackPosition : rows + 1);
                    }
                    latestBlackPosition = rows;
                    wordIndex++;
                } else if (this.getGrid()[rows][col].isBlack()) {
                    this.verticalWordLength[wordIndex] = rows - latestBlackPosition;
                    latestBlackPosition = rows;
                    wordIndex++;
                    blackOnLine = true;
                }
            }
        }
    }

    public testWordPosition(grid: Case[][]): void {
        const temp: Case[][] = this.getGrid();
        this.setGrid(grid);
        this.initialiseHorizontalWordArray();
        this.initialiseVerticalWordArray();
        this.setGrid(temp);
    }

    private initialiseHorizontalWordArray(): void {
        this._horizontalWordArray = [];
        let horizontalWordIndex: number = 0;

        for (let rows = 0; rows < this.getGrid().length; rows++) {
            for (let col = 0; col < this.getGrid().length; col++) {
                if (this.getGrid()[rows][col].isBlack() || col === this.getGrid().length - 1) {
                    if (this.horizontalWordLength[horizontalWordIndex] === 1 || this.horizontalWordLength[horizontalWordIndex] === 0) {
                        this.horizontalWordLength.splice(horizontalWordIndex, 1);
                    } else {
                        const initialPosition: number =
                            this.checkValidPosition(col - this.horizontalWordLength[horizontalWordIndex], rows, Orientation.horizontal);
                        this._horizontalWordArray.push(
                            new Word(
                                "",
                                "",
                                [rows, initialPosition],
                                Orientation.horizontal,
                                horizontalWordIndex,
                                false,
                                this.horizontalWordLength[horizontalWordIndex]
                            )
                        );
                        horizontalWordIndex++;
                    }
                }
            }
        }
    }

    private initialiseVerticalWordArray(): void {
        this._verticalWordArray = [];
        let verticalWordIndex: number = 0;

        for (let col = 0; col < this.getGrid().length; col++) {
            for (let rows = 0; rows < this.getGrid().length; rows++) {
                if (this.getGrid()[rows][col].isBlack() || rows === this.getGrid().length - 1) {
                    if (this.verticalWordLength[verticalWordIndex] === 1 || this.verticalWordLength[verticalWordIndex] === 0) {
                        this.verticalWordLength.splice(verticalWordIndex, 1);
                    } else {
                        const initialPosition: number =
                            this.checkValidPosition(rows - this.verticalWordLength[verticalWordIndex], col, Orientation.vertical);
                        this._verticalWordArray.push(
                            new Word(
                                "",
                                "",
                                [initialPosition, col],
                                Orientation.vertical,
                                verticalWordIndex,
                                false,
                                this.verticalWordLength[verticalWordIndex]
                            )
                        );
                        verticalWordIndex++;
                    }
                }
            }
        }
    }

    private checkValidPosition(positionToValidate: number, stablePosition: number, direction: Orientation): number {
        return (direction ?
            (positionToValidate === -1 || this.getGrid()[positionToValidate][stablePosition].isBlack() ?
                positionToValidate + 1 :
                positionToValidate) :
            (positionToValidate === -1 || this.getGrid()[stablePosition][positionToValidate].isBlack() ?
                positionToValidate + 1 :
                positionToValidate));
    }

    public async generateWords(difficulty: string): Promise < any > {
        let horizontalWordIndex: number = 0;
        let verticalWordIndex: number = 0;

        while (horizontalWordIndex < this._horizontalWordArray.length && verticalWordIndex < this._verticalWordArray.length) {
            const word: Word = horizontalWordIndex < verticalWordIndex ?
                this._horizontalWordArray[horizontalWordIndex] :
                this._verticalWordArray[verticalWordIndex];

            try {
                const { lexicalResult }: { lexicalResult: string } = await this.getWord(word, difficulty);

                if (horizontalWordIndex < verticalWordIndex) {
                    horizontalWordIndex = this.setWord(lexicalResult, word, horizontalWordIndex, verticalWordIndex, difficulty);
                } else {
                    verticalWordIndex = this.setWord(lexicalResult, word, verticalWordIndex, horizontalWordIndex, difficulty);
                }
            } catch (err) {
                if (horizontalWordIndex < verticalWordIndex) {
                    verticalWordIndex = this.removeWord(verticalWordIndex, word);
                } else {
                    horizontalWordIndex = this.removeWord(horizontalWordIndex, word);
                }
            }
        }
    }

    private async getWord(word: Word, difficulty: string): Promise < LexicalWord > {
        let commonality: string = "";

        switch (difficulty) {
            case "easy":
                commonality = "common"; break;
            case "hard":
                commonality = "uncommon"; break;
            case "normal":
                commonality = (Math.random() > this.randomGeneration ? "common" : "uncommon"); break;
            default:
                commonality = "InvalidEntry";
        }

        const FETCH_URL: string = `http://localhost:3000/lexical/wordsearch/${commonality}/${this.constructConstraintFor(word)}`;
        try {
            const response: AxiosResponse < any > = await axios.get(FETCH_URL);

            return response.data;
        } catch (err) {
            throw (err);
        }
    }

    private removeWord(index: number, word: Word): number {
        this.removeConstraintsFromArray(word);
        word.name = "";

        return index - 1;
    }

    private setWord(rawResponse: string, word: Word, index: number, removedIndex: number, difficulty: string): number {
        if (!this.checkWordExists(rawResponse)) {
            word.name = rawResponse;
            this.addConstraintsToArray(word);
            this._wordArray.push(word);

            return index + 1;
        } else {
            return this.removeWord(index, word);
        }
    }

    private checkWordExists(name: string): boolean {
        return !!this._horizontalWordArray.find((word: Word) => word.name === name) ||
            !!this._verticalWordArray.find((word: Word) => word.name === name);
    }

    private removeConstraintsFromArray(word: Word): void {
        const wordLength: number = word.length;
        for (let wordPosition: number = 0; wordPosition < wordLength; wordPosition++) {
            for (let constraintIndex: number = 0; constraintIndex < this._constraintsArray.length; constraintIndex++) {
                if (this.checkConstraints(word, constraintIndex, wordPosition)) {
                    this._constraintsArray[constraintIndex].amountOfWordsWithConstraint--;
                    if (this._constraintsArray[constraintIndex].amountOfWordsWithConstraint === 0) {
                        this._constraintsArray.splice(constraintIndex, 1);
                    }
                }
            }
        }
    }

    private addConstraintsToArray(word: Word): void {
        const wordLength: number = word.length
        let wordPosition: number = 0;
        if (this.isEmpty(this._constraintsArray)) {
            this.addConstraint(word, wordPosition);
            wordPosition = 1;
        }
        for (; wordPosition < wordLength; wordPosition++) {
            let checkConstraint: boolean = false;
            for (let constraintIndex: number = 0; constraintIndex < this._constraintsArray.length; constraintIndex++) {
                if (this.checkConstraints(word, constraintIndex, wordPosition)) {
                    this._constraintsArray[constraintIndex].amountOfWordsWithConstraint++;
                    checkConstraint = true;
                }
            }
            if (!checkConstraint) {
                this.addConstraint(word, wordPosition);
            }
        }
    }

    private constructConstraintFor(word: Word): string {
        let nonConstraints: number = 0;
        let constraintWord: string = "";
        const wordLength: number = word.length;
        for (let wordPosition: number = 0; wordPosition < wordLength; wordPosition++) {
            let checkConstraint: boolean = false;
            for (let constraintIndex: number = 0; constraintIndex < this._constraintsArray.length; constraintIndex++) {
                if (this.checkConstraints(word, constraintIndex, wordPosition)) {
                    if (nonConstraints !== 0) {
                        constraintWord += nonConstraints;
                        nonConstraints = 0;
                    }
                    constraintWord += this._constraintsArray[constraintIndex].constraint;
                    checkConstraint = true;
                    break;
                }
            }
            if (!checkConstraint) { nonConstraints++; }
        }
        if (nonConstraints === parseInt("10", 10)) {
            nonConstraints = parseInt("91", 10);
        }
        constraintWord += nonConstraints;

        return constraintWord;
    }

    private addConstraint(word: Word, wordPosition: number): void {
        (word.direction ?
            this._constraintsArray.push(new Constraint(word.name[wordPosition], word.row + wordPosition, word.col, 1)) :
            this._constraintsArray.push(new Constraint(word.name[wordPosition], word.row, word.col + wordPosition, 1)));
    }

    private checkConstraints(word: Word, constraintIndex: number, wordPosition: number): boolean {
        return (word.direction ?
            this._constraintsArray[constraintIndex].row === word.row + wordPosition &&
                this._constraintsArray[constraintIndex].col === word.col :
            this._constraintsArray[constraintIndex].row === word.row &&
                this._constraintsArray[constraintIndex].col === word.col + wordPosition);
    }

    private isEmpty(array: any[]): boolean {
        return array.length === 0;
    }

    public getVerticalWordLength(): number[] {
        return this.verticalWordLength;
    }

    public getHorizontalWordLength(): number[] {
        return this.horizontalWordLength;
    }

    public get horizontalWordArray(): Word[] {
        return this._horizontalWordArray;
    }

    public get verticalWordArray(): Word[] {
        return this._verticalWordArray;
    }
}
