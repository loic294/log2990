import { Case } from './case'
import GridGenerator from "./grid-generator";
import Word from "../../../../common/lexical/word"

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

    private findHorizontalWordLength() : void{
        this.horizontalWordLength = [];
        let latestBlackPosition : number = 0;
        let wordIndex : number = 0;
        let blackOnLine : boolean = false;
        for (let rows : number  = 0; rows < this.getGrille().length ; rows++){
            latestBlackPosition = 0;
            blackOnLine = false;
            for (let col: number = 0; col < this.getGrille().length ;  col++) {
                if (col ===  this.getGrille().length - 1) {
                    if (this.getGrille()[rows][col].isBlack()) {
                        this.horizontalWordLength[wordIndex] = col - latestBlackPosition;
                    } else {
                        this.horizontalWordLength[wordIndex] = (blackOnLine ? col - latestBlackPosition : col + 1);
                    }

                    latestBlackPosition = col;
                    wordIndex++;
                } else if (this.getGrille()[rows][col].isBlack()) {
                    this.horizontalWordLength[wordIndex] = col - latestBlackPosition;

                    latestBlackPosition = col;
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