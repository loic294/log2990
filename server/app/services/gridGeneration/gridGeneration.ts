// tslint:disable:no-console no-suspicious-comment max-func-body-length
// TODO: Remove disable!!
import { Cell } from "../../../../common/grid/case";
import Word, { Orientation } from "../../../../common/lexical/word";
// import Constraint from "./constraint";

export enum Difficulty {
    easy = 0,
    medium = 1,
    hard = 2
}

class Constraint extends Word {
    public constraints: Array<Object>;
    public size: number;

    constructor(
        public name: string,
        public desc: string,
        public position: Array<number>,
        public orientation: Orientation,
        public index: number = 0,
        public isValidated: boolean = false
    ) {
        super(name, desc, position, orientation, index, isValidated);
        this.constraints = [];
        this.size = name.length;
    }

    public get length(): number {
        return this.size;
    }

    public set length(size: number) {
        this.size = size;
    }

}
export default class GridGeneration {
    private _grid: Array<Array<Cell>>;
    // private _constraintsArray: Array<Constraint>;
    private _wordStack: Array<Word>;
    private _DEFAULT_SIZE: number = 10;
    private _gridSize: number = this._DEFAULT_SIZE;
    // private RANDOM_GENERATION: number = 0.7;
    private blackCellCount: number = 0;
    private maxBlackCells: number = 0.2;

    public constructor() {
        // this._constraintsArray = [];
        this._wordStack = [];
    }

    public fillGridWithCells(size: number): Array<Array<Cell>> {
        size = size !== undefined ? size : this._DEFAULT_SIZE;
        this._grid = [];
        this._gridSize = size;

        for (let row: number = 0; row < size; row++) {
            this._grid[row] = [];
            for (let col: number = 0; col < size; col++) {
                this._grid[row][col] = new Cell("◽", row, col);
            }
        }

        console.log("Fill grid");
        console.log(this.printGrid());

        return this._grid;
    }

    public hasMinWordSpace(row: number, col: number): boolean {
        const MIN_WORD_LENGTH: number = 2;
        const vertical: boolean = row === 1 || (this._grid[row - MIN_WORD_LENGTH] && !this._grid[row - MIN_WORD_LENGTH][col].isBlack());
        const horizontal: boolean = col === 1 || (this._grid[row][col - MIN_WORD_LENGTH]
            && !this._grid[row][col - MIN_WORD_LENGTH].isBlack());

        return vertical && horizontal;
    }

    public fillGridWithBlackCells(): void {
        this.traverseGrid((row: number, col: number) => {
            if (row > 0 && col > 0) {
                if (!this.grid[row][col].isBlack() && Math.random() < this.maxBlackCells && this.hasMinWordSpace(row, col)) {
                    this.grid[row][col].setBlack(true);
                    this.blackCellCount += 1;
                }
            }
        });

        if (this.blackCellCount < this.maxBlackCells * (this._gridSize ** 2)) {
            this.fillGridWithBlackCells();
        }

        console.log("Fill with black cells");
        console.log(this.printGrid());
    }

    public findIntersection(word1: Constraint, word2: Constraint): Array<number> {
        for (let i: number = 0; i < word1.length; i++) {
            if (i === word2.position[word1.orientation]) {
                return [i, word2.position[word1.orientation]];
            }
        }

        return [];
    }

    public intersects(word1: Constraint, word2: Constraint): boolean {
        if (word1.orientation === word2.orientation) {
            return false;
        }

        // console.log("INSTERSECT 1", word1.position, word2.position, word1.length, word2.length)
        // console.log(word1.position[0] <= word2.position[0] && word1.position[0] + word1.length >= word2.position[0]);
        // console.log(word2.position[1] <= word1.position[1] && word2.position[1] + word2.length >= word1.position[1]);
        // console.log("================");

        return word1.position[0] <= word2.position[0] && word1.position[0] + word1.length >= word2.position[0]
            && word2.position[1] <= word1.position[1] && word2.position[1] + word2.length >= word1.position[1];
    }

    public createConstraints(words: Array<Constraint>): void {
        const WORDS_COUNT: number = words.length;

        for (let first: number = 0; first < WORDS_COUNT; first++) {
            for (let second: number = first; second < WORDS_COUNT; second++) {
                if (this.intersects(words[first], words[second])) {
                    const intersection: Array<number> = this.findIntersection(words[first], words[second]);
                    console.log('INTERSECTION', intersection)
                    // console.log('INTERSECTS', words[first], words[second]);
                }
            }
        }
    }

    public findAllWordsSpaces(): void {
        const horizontalWords: Array<Constraint> = this.fillWordSpaceHorizontal(Orientation.horizontal);
        const verticalWords: Array<Constraint> = this.fillWordSpaceVertical(Orientation.vertical);

        let allWords: Array<Constraint> = [...horizontalWords, ...verticalWords];
        allWords = allWords
            .filter((word: Constraint) => {
                return word.size > 1;
            })
            .sort(function (a: Constraint, b: Constraint): number {
                if (a.size < b.size) {
                    return 1;
                }

                if (b.size > b.size) {
                    return -1;
                }

                return 0;
            });

        console.log("ALL WORDS", allWords.map(
            (word: Constraint) => ({ position: word.position, size: word.size, orientation: word.orientation }))
        );

        this.createConstraints(allWords);
    }

    public fillWordSpaceHorizontal(orientation: Orientation): Array<Constraint> {
        const wordsVertical: Array<Constraint> = [];
        let word: Constraint = new Constraint("", "", [0, 0], Orientation.horizontal);

        for (let row: number = 0; row < this._gridSize; row++) {
            word.position = [row, 0];
            for (let col: number = 0; col < this._gridSize; col++) {
                if (!this._grid[row][col].isBlack()) {
                    word.length += 1;
                } else {
                    wordsVertical.push(word);
                    while (col < this._gridSize && this._grid[row][col].isBlack()) {
                        col += 1;
                    }
                    word = new Constraint("", "", [0, 0], Orientation.horizontal);
                    word.position = [row, col];
                    if (this._grid[row][col - 1].isBlack() && col < this._gridSize) {
                        word.length = 1;
                    }
                }

                if (col === this._gridSize - 1) {
                    wordsVertical.push(word);
                    word = new Constraint("", "", [0, 0], Orientation.horizontal);
                }
            }
        }

        // console.log('HORIZONTAL WORD', wordsVertical.map(word => ({ position: word.position, size: word.size, orientation: word.orientation })));

        return wordsVertical;
    }

    public fillWordSpaceVertical(orientation: Orientation): Array<Constraint> {
        const wordsVertical: Array<Constraint> = [];
        let word: Constraint = new Constraint("", "", [0, 0], Orientation.vertical);

        for (let col: number = 0; col < this._gridSize; col++) {
            word.position = [0, col];

            for (let row: number = 0; row < this._gridSize; row++) {
                if (!this._grid[row][col].isBlack()) {
                    word.size += 1;
                } else {
                    wordsVertical.push(word);
                    while (row < this._gridSize && this._grid[row][col].isBlack()) {
                        row += 1;
                    }
                    word = new Constraint("", "", [0, 0], Orientation.vertical);
                    word.position = [row, col];
                    if (this._grid[row - 1][col].isBlack() && row < this._gridSize) {
                        word.length = 1;
                    }
                }

                if (row === this._gridSize - 1) {
                    wordsVertical.push(word);
                    word = new Constraint("", "", [0, 0], Orientation.vertical);
                }
            }
        }

        // console.log('VERTICAL WORD', wordsVertical.map(word => ({ position: word.position, size: word.size, orientation: word.orientation })));

        return wordsVertical;
    }

    public siwtchPosition(orientation: Orientation, value1: number, value2: number): Array<number> {
        return Orientation.horizontal ? [value1, value2] : [value2, value1];
    }

    public traverseGrid(fct: Function): void {
        if (this._grid[0]) {
            for (let row: number = 0; row < this._grid[0].length; row++) {
                for (let col: number = 0; col < this._grid[0].length; col++) {
                    fct(row, col);
                }
            }
        }
    }

    public printGrid(): String {
        let output: string = "";
        this.traverseGrid((row: number, col: number) => {
            const cell: Cell = this._grid[row][col];
            output += cell.isBlack() ? " ❌ " : ` ${cell.char} `;
            if (col === this._grid.length - 1) {
                output += "\n";
            }
        });

        return output;
    }

    public get grid(): Cell[][] {
        return this._grid;
    }

    public get DEFAULT_SIZE(): number {
        return this._DEFAULT_SIZE;
    }

    public get wordStack(): Array<Word> {
        return this._wordStack;
    }
}
