import Word from "../../../../common/lexical/word";
export default class Constraint {

    constructor(
        private _constraint: string,
        private _row: number,
        private _col: number,
        private _wordsWithConstraint: Array<string>
    ) { }

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

    public get words(): Array<string> {
        return this._wordsWithConstraint;
    }

    public addWordWithConstraint(word: Word): boolean {
        if (word.col === this._col || word.row === this._row) {
            this._wordsWithConstraint.push(word.name);

            return true;
        } else {
            return false;
        }
    }

    public removeWordWithConstraint(word: Word): boolean {
        const index: number = this._wordsWithConstraint.findIndex((wordWithConstraint: string) => word.name === wordWithConstraint);

        if (index === -1 || word.col !== this._col || word.row !== this._row) {
            return false;
        } else {
            this._wordsWithConstraint = this._wordsWithConstraint.splice(1, index);

            return true;
        }
    }
}
