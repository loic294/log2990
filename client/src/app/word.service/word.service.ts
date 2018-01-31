import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import Word from "../../../../common/lexical/word";

@Injectable()
export class WordService {
  private _word: Observable<Word>;
  private _wordSubject: Subject<Word> = new Subject<Word>();

  private _position: Observable<Word>;
  private _positionSubject: Subject<Word>= new Subject<Word>();

  public get word(): Observable<Word> {
    return this._word;
  }

  public selectWord(word: Word): void {
    this._wordSubject.next(word);
  }

  // Nom de fonction et d'attribut à modifier
  getPosition(): Observable<Word> {
      return this._position;
  }

  selectPosition(position: Word) {
      this._positionSubject.next(position);
  }

  constructor() {
    this._word = this._wordSubject.asObservable();
    this._position = this._positionSubject.asObservable();
   }

}
