export class Case {

    public constructor(
        private _char: string,
        private _x: number,
        private _y: number,
        private _isSelected: boolean,
        private _isValidated: boolean,
        private _black: boolean) { }

    public set char(c: string) {
        this._char = c;
    }

    public get char(): string {
        return this._char;
    }

    public select(): void {
        this._isSelected = true;
    }

    public unselect(): void {
        this._isSelected = false;
    }

    public selected(): boolean {
        return this._isSelected;
    }

    public get x(): number {
        return this._x;
    }

    public set x(x: number) {
        this._x = x;
    }

    public get y(): number {
        return this._y;
    }

    public set y(y: number) {
        this._y = y;
    }

    public get id(): string {
        return this.x.toString() + this.y.toString();
    }

    public get validated(): boolean {
        return this._isValidated;
    }

    public validate(): void {
        this._isValidated = true;
    }

    public isBlack() : boolean {
        return this._black;
    }

    public setBlack(black : boolean) : void{
        this._black = black;
    }

}
