import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import Word from "../../../../common/lexical/word";

@Injectable()
export class WordService {
    private _wordFromClue: Observable<Word>;
    private _wordFromClueSubject: Subject<Word> = new Subject<Word>();

    private _wordFromGrid: Observable<Word>;
    private _wordFromGridSubject: Subject<Word> = new Subject<Word>();

    public constructor() {
        this._wordFromClue = this._wordFromClueSubject.asObservable();
        this._wordFromGrid = this._wordFromGridSubject.asObservable();
    }

    public get wordFromClue(): Observable<Word> {
        return this._wordFromClue;
    }

    public selectWordFromClue(word: Word): void {
        this._wordFromClueSubject.next(word);
    }

    public get wordFromGrid(): Observable<Word> {
        return this._wordFromGrid;
    }

    public selectWordFromGrid(position: Word): void {
        this._wordFromGridSubject.next(position);
    }
}
