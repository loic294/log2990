import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import Word from "../../../../common/lexical/word";
import axios from "axios";
import { Cell } from "../../../../common/grid/cell";
@Injectable()
export class GridLoadingService {

    private _loadNewGrid: Observable<Array<Array<Cell>>>;
    private _gridLoad: Subject<Array<Array<Cell>>> = new Subject<Array<Array<Cell>>>();

    private _loadNewClues: Observable<Array<Word>>;
    private _cluesLoad: Subject<Array<Word>> = new Subject<Array<Word>>();

    public constructor() {
        this._loadNewGrid = this._gridLoad.asObservable();
        this._loadNewClues = this._cluesLoad.asObservable();
    }

    public async loadNewGrid(): Promise<void> {

        const url: string = "http://localhost:3000/grid/generate";
        const { data: { grid, clues } }: { data: { grid: Array<Array<Cell>>, clues: Array<Word> }} = await axios.get(url);

        let count: number = 0;
        const augmentedWords: Array<Word> = clues.map((clue) =>
            new Word(clue.name, clue.desc, clue.position, clue.orientation, count++, clue.isValidated));

        this._gridLoad.next(grid);
        this._cluesLoad.next(augmentedWords);
    }

    public setNewGrid(grid: Array<Array<Cell>>, clues: Array<Word>): void {
        let count: number = 0;
        const augmentedWords: Array<Word> = clues.map((clue) =>
            new Word(clue.name, clue.desc, clue.position, clue.orientation, count++, clue.isValidated));

        this._gridLoad.next(grid);
        this._cluesLoad.next(augmentedWords);
    }

    public get newGrid(): Observable<Array<Array<Cell>>> {
        return this._loadNewGrid;
    }

    public get newClues(): Observable<Array<Word>> {
        return this._loadNewClues;
    }

}
