export default class Constraint {

    constructor( 
        private _constraint : string,
        private _row : number,
        private _col : number
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
}