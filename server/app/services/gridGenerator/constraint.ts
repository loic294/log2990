export default class Constraint {

    constructor( 
        private _constraint : string,
        private _row : number,
        private _col : number,
        private _wordsWithConstraint : number
    ) {}
    
    public get constraint() {
        return this._constraint;
    }

    public get row() {
        return this._row;
    }

    public get col() {
        return this._col;
    }

    public get position() {
        return [this._row, this._col];
    }

    public get amountOfWordsWithConstraint(){
        return this._wordsWithConstraint;
    }
    
    public set amountOfWordsWithConstraint( amount : number) {
        this._wordsWithConstraint = amount;
    }
}