import { Case } from './case'
import GridGenerator from "./grid-generator";
import Word, { Orientation } from "../../../../common/lexical/word";

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

        this.initialiseWordArray();
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
        
        this.initialiseWordArray();

        this._wordArray.forEach(word => {
            console.log(word.position + " ok the fuck is happening at this direction "+ word.direction)
        });

        this.setGrille(temp);
    }

    private initialiseWordArray() : void{
        this._wordArray = [];
        let horizontalWordIndex : number = 0;
        let verticalWordIndex : number = 0;

        for (let firstIndex : number = 0; firstIndex < this.getGrille().length; firstIndex++){
            for (let secondIndex : number = 0; secondIndex < this.getGrille().length; secondIndex++){
                if (this.getGrille()[firstIndex][secondIndex].isBlack() || secondIndex === this.getGrille().length - 1){
                    if (this.horizontalWordLength[horizontalWordIndex] === 1) {
                        this.horizontalWordLength.splice(horizontalWordIndex, 1);
                    } else {
                        this._wordArray.push(new Word("", "", [firstIndex, secondIndex], Orientation.horizontal, horizontalWordIndex));
                        horizontalWordIndex++;
                    }
                }

                if (this.getGrille()[secondIndex][firstIndex].isBlack() || secondIndex === this.getGrille().length - 1) {
                    if (this.verticalWordLength[verticalWordIndex] === 1) {
                        this.verticalWordLength.splice(verticalWordIndex, 1);
                    } else {
                        this._wordArray.push(new Word("", "", [secondIndex , firstIndex], Orientation.vertical, verticalWordIndex));

                        verticalWordIndex++
                    }
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

    public get wordArray() : Word[] {
        return this._wordArray;
    }
}