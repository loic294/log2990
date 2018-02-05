import { Case } from "../../../../common/grid/case";
import GridGenerator from "./grid-generator";
import Word, { Orientation } from "../../../../common/lexical/word";
import Constraint from "./constraint";
import LexicalService from ".././lexical";
import axios, { AxiosResponse , AxiosWords } from "axios";

export default class WordGenerator extends GridGenerator{

    private horizontalWordLength: number[] = [];
    private verticalWordLength: number[] = [];
    private _horizontalWordArray: Word[] = [];
    private _verticalWordArray: Word[] = [];
    private _constraintsArray: Constraint[] = [];

    constructor() {
        super();

        this.findHorizontalWordLength();
        this.findVerticalWordLength();

        this.initialiseHorizontalWordArray();
        this.initialiseVerticalWordArray();

        //this.generateWords();
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
        for (let rows : number  = 0; rows < this.getGrid().length ; rows++){
            latestBlackPosition =  0;
            blackOnLine = false;
            for (let col: number = 0; col < this.getGrid().length ;  col++) {
                if (col ===  this.getGrid().length - 1) {
                    if (this.getGrid()[rows][col].isBlack()) {
                        this.horizontalWordLength[wordIndex] = col - latestBlackPosition;
                    } else {
                        this.horizontalWordLength[wordIndex] = (blackOnLine ? col - latestBlackPosition : col + 1);
                    }

                    wordIndex++;
                } else if (this.getGrid()[rows][col].isBlack()) {
                    this.horizontalWordLength[wordIndex] = col - latestBlackPosition;

                    latestBlackPosition =  col;
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
        for (let col: number  = 0; col < this.getGrid().length ; col++){
            latestBlackPosition = 0;
            blackOnLine = false;
            for (let rows: number = 0; rows < this.getGrid().length ;  rows++){
                if (rows ===  this.getGrid().length - 1) {
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

    private initialiseHorizontalWordArray(): void{
        this._horizontalWordArray = [];
        let horizontalWordIndex: number = 0;

        for (let rows: number = 0; rows < this.getGrid().length; rows++) {
            for (let col: number = 0; col < this.getGrid().length; col++) {
                if (this.getGrid()[rows][col].isBlack() || col === this.getGrid().length - 1){
                    if (this.horizontalWordLength[horizontalWordIndex] === 1 || this.horizontalWordLength[horizontalWordIndex] === 0) {
                        this.horizontalWordLength.splice(horizontalWordIndex, 1);
                    } else {
                        let initialPosition = this.checkValidPosition(col - this.horizontalWordLength[horizontalWordIndex], rows, Orientation.horizontal);
                        this._horizontalWordArray.push(new Word("", "", [initialPosition, rows], Orientation.horizontal, horizontalWordIndex));
                        horizontalWordIndex++;
                    }
                }
            }
        }
    }

    private initialiseVerticalWordArray(): void {
        this._verticalWordArray = [];
        let verticalWordIndex: number = 0;

        for (let col: number = 0; col < this.getGrid().length; col++) {
            for (let rows: number = 0; rows < this.getGrid().length; rows++) {
                if (this.getGrid()[rows][col].isBlack() || rows === this.getGrid().length - 1) {
                    if (this.verticalWordLength[verticalWordIndex] === 1 || this.verticalWordLength[verticalWordIndex] === 0) {
                        this.verticalWordLength.splice(verticalWordIndex, 1);
                    } else {
                        let initialPosition = this.checkValidPosition(rows - this.verticalWordLength[verticalWordIndex], col, Orientation.vertical);
                        this._verticalWordArray.push(new Word("", "", [initialPosition, col], Orientation.vertical, verticalWordIndex));
                        verticalWordIndex++;
                    }
                }
            }
        }
    }

    private checkValidPosition( positionToValidate: number, stablePosition: number, direction: Orientation): number {
        return (direction ?
            (positionToValidate === -1 || this.getGrid()[positionToValidate][stablePosition].isBlack() ?
                positionToValidate + 1 :
                positionToValidate) :
            (positionToValidate === -1 || this.getGrid()[stablePosition][positionToValidate].isBlack() ?
                positionToValidate + 1 :
                positionToValidate));
    }

    private async generateWords() {
        let horizontalWordIndex: number = 0;
        let verticalWordIndex: number = 0;

        while (horizontalWordIndex < this._horizontalWordArray.length && verticalWordIndex < this._verticalWordArray.length){
            let word = (horizontalWordIndex < verticalWordIndex ?
                this._horizontalWordArray[horizontalWordIndex] :
                this._verticalWordArray[verticalWordIndex]);
            try {
                const { data }: { data: Array<AxiosWords> } = await this.getWord(word);

                if (horizontalWordIndex < verticalWordIndex) {
                    horizontalWordIndex = this.setWord(data, word, horizontalWordIndex);
                } else {
                    verticalWordIndex = this.setWord(data, word, verticalWordIndex);
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

    private async getWord(word: Word): Promise<any> {
        let FETCH_URL: string = `http://localhost:3000/lexical/wordsearch/common/${this.constructConstraintFor(word)}`;
        try {
            const response: AxiosResponse<any> = await axios.get(FETCH_URL);

            return response.data;
        } catch (err) {
            FETCH_URL = `http://localhost:3000/lexical/wordsearch/uncommon/${this.constructConstraintFor(word)}`;
            try {
                const result: AxiosResponse<any> = await axios.get(FETCH_URL);

                return result.data;
            } catch (err) {
                throw(err);
            }
        }
    }

    private removeWord(index: number, word: Word): number {
        this.removeConstraintsFromArray(word);
        word.name = "";

        return index --;
    }

    private setWord(rawResponse: Array<AxiosWords>, word: Word, index: number): number {
        word.name = rawResponse[0].word;
        this.addConstraintsToArray(word);

        return index++;
    }

    private removeConstraintsFromArray(word: Word): void {
        const wordLength: number = (word.direction ? this.horizontalWordLength[word.index] : this.verticalWordLength[word.index]);
        for (let wordPosition: number  = 0; wordPosition < wordLength; wordPosition++ ) {
            for (let constraintIndex: number = 0; constraintIndex < this._constraintsArray.length; constraintIndex ++) {
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
        const wordLength: number = (word.direction ? this.horizontalWordLength[word.index] : this.verticalWordLength[word.index]);
        let wordPosition: number = 0;
        if (this.isEmpty(this._constraintsArray)) {
            this.addConstraint(word, wordPosition);
            wordPosition = 1;
        }
        for (; wordPosition < wordLength; wordPosition++ ) {
            for (let constraintIndex: number = 0; constraintIndex < this._constraintsArray.length; constraintIndex ++) {
                if (this.checkConstraints(word, constraintIndex, wordPosition)) {
                    this._constraintsArray[constraintIndex].amountOfWordsWithConstraint++;
                } else {
                    this.addConstraint(word, wordPosition);
                }
            }
        }
    }

    private constructConstraintFor(word: Word): string {
        let nonConstraints: number = 0;
        let constraintWord: string = "";
        const wordLength: number = (word.direction ? this.horizontalWordLength[word.index] : this.verticalWordLength[word.index]);
        for (let wordPosition: number  = 0; wordPosition < wordLength; wordPosition++ ) {
            for (let constraintIndex: number = 0; constraintIndex < this._constraintsArray.length; constraintIndex ++) {
                if (this.checkConstraints(word, constraintIndex, wordPosition)) {
                        constraintWord += nonConstraints;
                        nonConstraints = 0;
                        constraintWord += this._constraintsArray[constraintIndex];
                } else {
                        nonConstraints ++;
                }
            }
        }

        return constraintWord;
    }

    private addConstraint(word: Word, wordPosition: number): void {
        (word.direction ?
            this._constraintsArray.push(new Constraint(word.name[wordPosition], word.row + wordPosition, word.col, 1)) :
            this._constraintsArray.push(new Constraint(word.name[wordPosition], word.row, word.col + wordPosition, 1)));
    }

    private checkConstraints(word: Word, constraintIndex: number, wordPosition: number): boolean {
        return (word.direction ?
            this._constraintsArray[constraintIndex].position === [word.row + wordPosition, word.col] :
            this._constraintsArray[constraintIndex].position === [word.row, word.col + wordPosition]);
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
