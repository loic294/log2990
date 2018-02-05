export default class Constraint {

    constructor(
        private _constraint: string,
        private _row: number,
        private _col: number,
        private _wordsWithConstraint: number
    ) {}

    public get constraint(): string {
        return this._constraint;
    }

    public get row(): number {
        return this._row;
    }

    public get col(): number {
        return this._col;
    }

    public get position(): number[] {
        return [this._row, this._col];
    }

    public get amountOfWordsWithConstraint(): number {
        return this._wordsWithConstraint;
    }

    public set amountOfWordsWithConstraint( amount: number) {
        this._wordsWithConstraint = amount;
    }
}
