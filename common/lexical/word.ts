export enum Orientation {
    horizontal = 0,
    vertical = 1,
}

export default class Word {
  
    constructor(
        private _name : string,
        private _desc : string,
        private _position : Array<number>,
        private _orientation : Orientation,
        private _index : number,
        private _isValidated: boolean = false
    ) {}

    public get name() {
        return this._name;
    }

    public get desc() {
        return this._desc;
    }

    public get position() {
        return this._position
    }

<<<<<<< HEAD
    public set position( position : Array<number> ) {
        this._position = position;
    }

=======
>>>>>>> f130fa0e70e2d90fd5ba410331585784e6fb783a
    public get col () {
        return this._position[1]
    }

    public get row () {
        return this._position[0]
    }

    public get direction() {
        return this._orientation;
    }

    public get length() {
        return this._name.length;
    }
    
    public get validated() {
        return this._isValidated
    }
    
    public validate() {
        this._isValidated = true
    }

    public get index() {
        return this._index;
    }

    public set index( index : number ) {
        this._index = index;
    }

}