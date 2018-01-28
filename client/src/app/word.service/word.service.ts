import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import Word from "../../../../common/lexical/word";

@Injectable()
export class WordService {
    private _word: Observable<Word>;
    private _wordSubject: Subject<Word> = new Subject<Word>();

    public get word(): Observable<Word> {
        return this._word;
    }

    public selectWord(word: Word): void {
        this._wordSubject.next(word);
    }

    public constructor() {
        this._word = this._wordSubject.asObservable();
    }

}
