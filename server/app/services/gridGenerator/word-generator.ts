import { Case } from "../../../../common/grid/case";
import GridGenerator from "./grid-generator";
import Word, { Orientation } from "../../../../common/lexical/word";
import Constraint from "./constraint";
// import LexicalService from ".././lexical";
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

    constructor() {
        super();

        this.findHorizontalWordLength();
        this.findVerticalWordLength();

        this.initialiseHorizontalWordArray();
        this.initialiseVerticalWordArray();
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
        let latestBlackPosition = 0;
        let wordIndex = 0;
        let blackOnLine = false;
        for (let rows  = 0; rows < this.getGrid().length ; rows++) {
            latestBlackPosition =  0;
            blackOnLine = false;
            for (let col = 0; col < this.getGrid().length ;  col++) {
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
        let latestBlackPosition = 0;
        let wordIndex = 0;
        let blackOnLine = false;
        for (let col  = 0; col < this.getGrid().length ; col++) {
            latestBlackPosition = 0;
            blackOnLine = false;
            for (let rows = 0; rows < this.getGrid().length ;  rows++) {
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

    private initialiseHorizontalWordArray(): void {
        this._horizontalWordArray = [];
        let horizontalWordIndex = 0;

        for (let rows = 0; rows < this.getGrid().length; rows++) {
            for (let col = 0; col < this.getGrid().length; col++) {
                if (this.getGrid()[rows][col].isBlack() || col === this.getGrid().length - 1) {
                    if (this.horizontalWordLength[horizontalWordIndex] === 1 || this.horizontalWordLength[horizontalWordIndex] === 0) {
                        this.horizontalWordLength.splice(horizontalWordIndex, 1);
                    } else {
                        const initialPosition = this.checkValidPosition(col - this.horizontalWordLength[horizontalWordIndex], rows, Orientation.horizontal);
                        this._horizontalWordArray.push(new Word("", "", [initialPosition, rows], Orientation.horizontal, horizontalWordIndex));
                        horizontalWordIndex++;
                    }
                }
            }
        }
    }

    private initialiseVerticalWordArray(): void {
        this._verticalWordArray = [];
        let verticalWordIndex = 0;

        for (let col = 0; col < this.getGrid().length; col++) {
            for (let rows = 0; rows < this.getGrid().length; rows++) {
                if (this.getGrid()[rows][col].isBlack() || rows === this.getGrid().length - 1) {
                    if (this.verticalWordLength[verticalWordIndex] === 1 || this.verticalWordLength[verticalWordIndex] === 0) {
                        this.verticalWordLength.splice(verticalWordIndex, 1);
                    } else {
                        const initialPosition = this.checkValidPosition(rows - this.verticalWordLength[verticalWordIndex], col, Orientation.vertical);
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

    public async generateWords(difficulty: string): Promise<any> {
        let horizontalWordIndex: number = 0;
        let verticalWordIndex: number = 0;

        console.log('GENERATE')

        while (horizontalWordIndex < this._horizontalWordArray.length && verticalWordIndex < this._verticalWordArray.length) {

            console.log('IN WHILE')
            const word: Word = horizontalWordIndex < verticalWordIndex ?
                this._horizontalWordArray[horizontalWordIndex] :
                this._verticalWordArray[verticalWordIndex];

            try {

                console.log('TRY GET GET WORD', word)
                const { lexicalResult }: { lexicalResult: string  } = await this.getWord(word, difficulty);
                console.log('RESULT', lexicalResult)

                if (horizontalWordIndex < verticalWordIndex) {
                    console.log("INDEX BEFORE setWORD horizontal", horizontalWordIndex)
                    horizontalWordIndex = this.setWord(lexicalResult, word, horizontalWordIndex, difficulty);
                    console.log("INDEX AFTER setWORD horizontal", horizontalWordIndex)
                } else {

                    console.log("INDEX BEFORE setWORD vertical", verticalWordIndex)
                    verticalWordIndex = this.setWord(lexicalResult, word, verticalWordIndex, difficulty);
                    console.log("INDEX AFTER setWORD vertical", horizontalWordIndex)
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

    private async getWord(word: Word, difficulty: string): Promise<LexicalWord> {

        let commonality: string = "";

        console.log('GETTING WORD')

        switch (difficulty) {
            case "easy": commonality = "common"; break;
            case "hard": commonality = "uncommon"; break;
            case "normal": commonality = (Math.random() > this.randomGeneration ? "common" : "uncommon"); break;
            default: commonality = "InvalidEntry";
        }

        console.log('WORD CONSTRAINT', word, this.constructConstraintFor(word))
        const FETCH_URL = `http://localhost:3000/lexical/wordsearch/${commonality}/${this.constructConstraintFor(word)}`;
        try {
            const response: AxiosResponse<any> = await axios.get(FETCH_URL);
            console.log('DATA', response.data)
            return response.data;
        } catch (err) {
            throw(err);
        }
    }

    private removeWord(index: number, word: Word): number {
        console.log("REMOVE WORD")
        this.removeConstraintsFromArray(word);
        word.name = "";

        return index - 1;
    }

    private setWord(rawResponse: string, word: Word, index: number, difficulty: string): number {
        if (!this.checkWordExists(rawResponse)) {
            word.name = rawResponse;
            this.addConstraintsToArray(word);
            console.log("INDEX", index + 1)
            return index + 1;
        } else {
            console.log("INDEX FALSE", index)
            return index;
        }

    }

    private checkWordExists(name: string): boolean {
        return !!this._horizontalWordArray.find((word: Word) => word.name === name)
            || !!this._verticalWordArray.find((word: Word) => word.name === name);
    }

    private removeConstraintsFromArray(word: Word): void {
        const wordLength: number = (word.direction ? this.horizontalWordLength[word.index] : this.verticalWordLength[word.index]);
        for (let wordPosition  = 0; wordPosition < wordLength; wordPosition++ ) {
            for (let constraintIndex = 0; constraintIndex < this._constraintsArray.length; constraintIndex ++) {
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
        let wordPosition = 0;
        if (this.isEmpty(this._constraintsArray)) {
            this.addConstraint(word, wordPosition);
            wordPosition = 1;
        }
        for (; wordPosition < wordLength; wordPosition++ ) {
            let checkConstraint: boolean = false;
            for (let constraintIndex = 0; constraintIndex < this._constraintsArray.length; constraintIndex ++) {
                if (this.checkConstraints(word, constraintIndex, wordPosition)) {
                    this._constraintsArray[constraintIndex].amountOfWordsWithConstraint++;
                    checkConstraint = true;
                }
            }
            if (!checkConstraint) {
                this.addConstraint(word, wordPosition);
                console.log('ADD CONSTRAINT')
                    
            }
        }
    }

    private constructConstraintFor(word: Word): string {
        let nonConstraints: number = 0;
        console.log('NC INIT', nonConstraints)
        let constraintWord: string = "";
        let wordPosition: number = 0;
        const wordLength: number = (word.direction ? this.horizontalWordLength[word.index] : this.verticalWordLength[word.index]);
        if (this.isEmpty(this._constraintsArray)) {
            this.addConstraint(word, wordPosition);
            wordPosition = 1;
        }
        for (; wordPosition < wordLength; wordPosition++ ) {
            let checkConstraint = false;
            for (let constraintIndex: number = 0; constraintIndex < this._constraintsArray.length; constraintIndex ++) {
                if (this.checkConstraints(word, constraintIndex, wordPosition)) {
                    console.log('CONSTRAINT', this._constraintsArray[constraintIndex].constraint)
                    if (nonConstraints !== 0) {
                        constraintWord += nonConstraints;
                        console.log('NC 1', nonConstraints)
                        nonConstraints = 0;
                    }
                    constraintWord += this._constraintsArray[constraintIndex].constraint;
                    checkConstraint = true;
                    break;
                }
            }
            if (!checkConstraint) {
                nonConstraints++;
                console.log('ADD CONSTRAINT')
                    
            }
        }
        console.log('NC 2', nonConstraints)
        if (nonConstraints === 10) {
            nonConstraints = 91;
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
            this._constraintsArray[constraintIndex].position === [word.row + wordPosition, word.col] :
            this._constraintsArray[constraintIndex].position === [word.row, word.col + wordPosition]);
    }

    private isEmpty(array: any[]): boolean {
        return array.length === 0;
    }

    // private async checkDefinitionExists(wordName: string, word: Word, difficulty: string): Promise<boolean> {
    //     let level = "";

    //     switch (difficulty) {
    //         case "easy": level = "easy"; break;
    //         case "hard": level = "hard"; break;
    //         case "normal": level = (Math.random() > this.randomGeneration ? "easy" : "hard"); break;
    //         default: level = "InvalidEntry";
    //     }

    //     const FETCH_URL = `http://localhost:3000//lexical/wordDefinition/${level}/${wordName}`;
    //     try {
    //         const response: AxiosResponse<any> = await axios.get(FETCH_URL);

    //         word.desc = response.data;

    //         return true;
    //     } catch (err) {
    //         return false;
    //     }
    // }

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
