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

    public getName() {
        return this._name
    }

    public getDesc() {
        return this._desc
    }

    public getPosition() {
        return this._postiion
    }

    public getCol () {
        return this._postiion[0]
    }

    public getRow () {
        return this._postiion[1]
    }

    public getDirection() {
        return this._orientation
    }

    public getLength() {
        return this._name.length
    }

}