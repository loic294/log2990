import Word from "../../../../common/lexical/word";
export default class Constraint {

    public constructor(
        private _constraint: string,
        private _row: number,
        private _col: number,
        private _constrainedWords: Array<string>
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
        return this._constrainedWords;
    }

    public addConstrainedWord(word: Word): boolean {
        if (this.checkWordHasConstraint(word)) {
            this._constrainedWords.push(word.name);

            return true;
        } else {
            return false;
        }
    }

    public removeConstrainedWord(word: Word): boolean {
        const index: number = this._constrainedWords.findIndex((constrainedWord: string) => word.name === constrainedWord);

        if (index === -1 || !this.checkWordHasConstraint(word)) {
            return false;
        } else {
            this._constrainedWords = this._constrainedWords.splice(1, index);

            return true;
        }
    }

    public checkWordHasConstraint(word: Word): boolean {
        for (let pos: number = 0; pos < word.length; pos++) {
            const posi: number[] = (word.direction ? [word.row + pos, word.col] : [word.row, word.col + pos]);
            if (posi[0] === this._row && posi[1] === this._col) {
                return true;
            }
        }

        return false;
    }
}
