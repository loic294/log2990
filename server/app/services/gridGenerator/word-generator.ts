import { Case } from './case'
import GridGenerator from "./grid-generator";
import Word, { Orientation } from "../../../../common/lexical/word"

enum Difficulte {
    facile,
    normal,
    difficile,
}

export default class WordGenerator extends GridGenerator{

    private horizontalWordLength : number[] = [];
    private verticalWordLength : number[] = [];
    private _wordArray : Word[] = [];

    constructor(){
        super();
        this.findHorizontalWordLength();
        this.findVerticalWordLength();
    }

    public findWordLength(grille : Case[][]) : void{
        let temp : Case[][] = this.getGrille();
        this.setGrille(grille);
        
        
        this.findVerticalWordLength();
        this.findHorizontalWordLength();

        this.setGrille(temp);
    }

    private initialiseWordArray() : void{
        let horizontalWordIndex : number = 0;
        let verticalWordIndex : number = 0;

        for (let firstIndex : number = 0; firstIndex < this.getGrille().length; firstIndex++){
            for (let secondIndex : number = 0; secondIndex < this.getGrille().length; secondIndex++){
                if (this.getGrille()[firstIndex][secondIndex].isBlack() || secondIndex === this.getGrille().length - 1){
                    this._wordArray[verticalWordIndex + horizontalWordIndex] =  new Word("", "", [0, 0], Orientation.horizontal, horizontalWordIndex);
                    horizontalWordIndex++;
                }

                if (this.getGrille()[secondIndex][firstIndex].isBlack() || secondIndex === this.getGrille().length - 1) {
                    this._wordArray[verticalWordIndex + horizontalWordIndex] = new Word("", "", [0, 0], Orientation.vertical, verticalWordIndex);
                    verticalWordIndex++
                }
        }
    }

    private findHorizontalWordLength() : void{
        this.horizontalWordLength = [];
        let wordIndex : number = 0;
        let blackOnLine : boolean = false;
        for (let rows : number  = 0; rows < this.getGrille().length ; rows++){
            this._wordArray[wordIndex].position = [rows, 0];
            blackOnLine = false;
            for (let col: number = 0; col < this.getGrille().length ;  col++) {
                if (col ===  this.getGrille().length - 1) {
                    if (this.getGrille()[rows][col].isBlack()) {
                        this.horizontalWordLength[wordIndex] = col - this._wordArray[wordIndex].col;
                    } else {
                        this.horizontalWordLength[wordIndex] = (blackOnLine ? col - this._wordArray[wordIndex].col : col + 1);
                    }

                    wordIndex++;
                } else if (this.getGrille()[rows][col].isBlack()) {
                    this.horizontalWordLength[wordIndex] = col - this._wordArray[wordIndex].col;

                    this._wordArray[wordIndex].position = [rows, col+1];
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

    public generateWords() {
        
    }

    public getVerticalWordLength() : number[] {
        return this.verticalWordLength;
    }
    
    public getHorizontalWordLength() : number[] {
        return this.horizontalWordLength;
    }
}