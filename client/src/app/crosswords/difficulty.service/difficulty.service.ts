import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Difficulty } from "./../../../../../common/grid/difficulties";

@Injectable()
export class DifficultyService {
    private _difficulty: Observable<Difficulty>;
    private _difficultySubject: Subject<Difficulty> = new Subject<Difficulty>();

    public constructor() {
        this._difficulty = this._difficultySubject.asObservable();
    }

    public get difficulty(): Observable<Difficulty> {
        return this._difficulty;
    }

    public selectDifficulty(diff: Difficulty): void {
        this._difficultySubject.next(diff);
    }
}
