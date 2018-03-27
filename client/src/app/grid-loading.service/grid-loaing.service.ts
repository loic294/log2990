import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import Word from "../../../../common/lexical/word";
import axios from "axios";

@Injectable()
export class GridLoadingService {

    private _loadNewGrid: Observable<Array<String>>;
    private _gridLoad: Subject<Array<String>> = new Subject<Array<String>>();

    private _loadNewClues: Observable<Array<Word>>;
    private _cluesLoad: Subject<Array<Word>> = new Subject<Array<Word>>();

    public constructor() {
        this._loadNewGrid = this._gridLoad.asObservable();
        this._loadNewClues = this._cluesLoad.asObservable();
        this.initGrid();
    }

    public initGrid(): void {
        const DELAY: number = 500;
        setTimeout(() => {
            this.loadNewGrid();
        },         DELAY);
    }

    public async loadNewGrid(): Promise<void> {

        const url: string = "http://localhost:3000/grid/mock/0";
        const { data: { grid, clues } }: { data: { grid: Array<String>, clues: Array<Word> }} = await axios.get(url);

        const augmentedWords: Array<Word> = clues.map((clue) =>
            new Word(clue.name, clue.desc, clue.position, clue.orientation, clue.index, clue.isValidated));

        this._gridLoad.next(grid);
        this._cluesLoad.next(augmentedWords);
    }

    public get newGrid(): Observable<Array<String>> {
        return this._loadNewGrid;
    }

    public get newClues(): Observable<Array<Word>> {
        return this._loadNewClues;
    }

}
