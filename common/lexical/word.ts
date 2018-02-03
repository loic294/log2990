export enum Orientation {
    horizontal = 0,
    vertical = 1,
}

export default class Word {
  
    constructor(
        private _name : string,
        private _desc : string,
        private _postiion : Array<number>,
        private _orientation : Orientation,
    ) {}

    public get name() {
        return this._name;
    }

    public get desc() {
        return this._desc;
    }

    public get position() {
        return this._postiion;
    }

    public get col () {
        return this._postiion[1];
    }

    public get row () {
        return this._postiion[0];
    }

    public get direction() {
        return this._orientation;
    }

    public get length() {
        return this._name.length;
    }

}