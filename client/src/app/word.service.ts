import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import Word from "../../../common/lexical/word";

@Injectable()
export class WordService
{
  private _word: Observable<Word>;
  private _wordSubject = new Subject<Word>();

  getWord(): Observable<Word> {
    return this._word;
  }

  selectWord(word: Word): void {
    this._wordSubject.next(word);
  }

  constructor() {
    this._word = this._wordSubject.asObservable();
   }

}
