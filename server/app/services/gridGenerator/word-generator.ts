import { Case } from './case'
import GridGenerator from "./grid-generator";
import Word, { Orientation } from "../../../../common/lexical/word";
import Constraint from "./constraint"
import LexicalService from ".././lexical";

export default class WordGenerator extends GridGenerator{

    private horizontalWordLength : number[] = [];
    private verticalWordLength : number[] = [];
    private _horizontalWordArray : Word[] = [];
    private _verticalWordArray : Word[] = [];
    private _constraintsArray : Constraint[] = [];
    private _lexicalService = new LexicalService();

    constructor(){
        super();

        this.findHorizontalWordLength();
        this.findVerticalWordLength();

        this.initialiseHorizontalWordArray();
        this.initialiseVerticalWordArray();
    }

    public testWordLength(grid : Case[][]) : void{
        let temp : Case[][] = this.getGrille();
        this.setGrille(grid);
        
        
        this.findVerticalWordLength();
        this.findHorizontalWordLength();

        this.setGrille(temp);
    }

    private findHorizontalWordLength() : void{
        this.horizontalWordLength = [];
        let latestBlackPosition : number = 0;
        let wordIndex : number = 0;
        let blackOnLine : boolean = false;
        for (let rows : number  = 0; rows < this.getGrille().length ; rows++){
            latestBlackPosition =  0;
            blackOnLine = false;
            for (let col: number = 0; col < this.getGrille().length ;  col++) {
                if (col ===  this.getGrille().length - 1) {
                    if (this.getGrille()[rows][col].isBlack()) {
                        this.horizontalWordLength[wordIndex] = col - latestBlackPosition;
                    } else {
                        this.horizontalWordLength[wordIndex] = (blackOnLine ? col - latestBlackPosition : col + 1);
                    }

                    wordIndex++;
                } else if (this.getGrille()[rows][col].isBlack()) {
                    this.horizontalWordLength[wordIndex] = col - latestBlackPosition;

                    latestBlackPosition =  col;
                    wordIndex++;
                    blackOnLine = true;
                }
            }
        }
    }

    private findVerticalWordLength() : void{
        this.verticalWordLength = [];
        let latestBlackPosition : number = 0;
        let wordIndex : number = 0;
        let blackOnLine : boolean = false;
        for (let col : number  = 0; col < this.getGrille().length ; col++){
            latestBlackPosition = 0;
            blackOnLine = false;
            for (let rows : number = 0; rows < this.getGrille().length ;  rows++){
                if (rows ===  this.getGrille().length - 1) {
                    if (this.getGrille()[rows][col].isBlack()) {
                        this.verticalWordLength[wordIndex] = rows - latestBlackPosition;
                    } else {
                        this.verticalWordLength[wordIndex] = (blackOnLine ? rows - latestBlackPosition : rows + 1);
                    }

                    latestBlackPosition = rows;
                    wordIndex++;
                } else if (this.getGrille()[rows][col].isBlack()) {
                    this.verticalWordLength[wordIndex] = rows - latestBlackPosition;

                    latestBlackPosition = rows;
                    wordIndex++;
                    blackOnLine = true;
                }
            }
        }
    }

    public testWordPosition(grid : Case[][]) : void {
        let temp : Case[][] = this.getGrille();
        this.setGrille(grid);
        
        this.initialiseHorizontalWordArray();
        this.initialiseVerticalWordArray();

        this.setGrille(temp);
    }

    private initialiseHorizontalWordArray() : void{
        this._horizontalWordArray = [];
        let horizontalWordIndex : number = 0;

        for (let rows : number = 0; rows < this.getGrille().length; rows++){
            for (let col : number = 0; col < this.getGrille().length; col++){
                if (this.getGrille()[rows][col].isBlack() || col === this.getGrille().length - 1){
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

    private initialiseVerticalWordArray() : void {
        this._verticalWordArray = [];
        let verticalWordIndex : number = 0;

        for (let col : number = 0; col < this.getGrille().length; col++){
            for (let rows : number = 0; rows < this.getGrille().length; rows++){
                if (this.getGrille()[rows][col].isBlack() || rows === this.getGrille().length - 1){
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

    private checkValidPosition( positionToValidate : number, stablePosition : number, direction : Orientation){
        return (direction ? (positionToValidate === -1 || this.getGrille()[positionToValidate][stablePosition].isBlack() ? positionToValidate + 1 : positionToValidate) : (positionToValidate === -1 || this.getGrille()[stablePosition][positionToValidate].isBlack() ? positionToValidate + 1 : positionToValidate));
    }

    private generateWords() {

    }

    public getVerticalWordLength() : number[] {
        return this.verticalWordLength;
    }
    
    public getHorizontalWordLength() : number[] {
        return this.horizontalWordLength;
    }

    public get horizontalWordArray() : Word[] {
        return this._horizontalWordArray;
    }
    
    public get verticalWordArray() : Word[] {
        return this._verticalWordArray;
    }
}