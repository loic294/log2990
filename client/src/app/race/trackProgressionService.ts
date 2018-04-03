import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";

@Injectable()
export class TrackProgressionService {
    private _gameFinished: Observable<boolean>;
    private _gameFinishedSubject: Subject<boolean> = new Subject<boolean>();

    private _gameTime: Observable<number>;
    private _gameTimeSubject: Subject<number> = new Subject<number>();

    public constructor() {
        this._gameFinished = this._gameFinishedSubject.asObservable();
        this._gameTime = this._gameTimeSubject.asObservable();
    }

    public get gameFinished(): Observable<boolean> {
        return this._gameFinished;
    }

    public get gameTime(): Observable<number> {
        return this._gameTime;
    }

    public sendGameProgress(gameFinished: boolean): void {
        this._gameFinishedSubject.next(gameFinished);
    }

    public sendGameTime(gameTime: number): void {
        this._gameTimeSubject.next(gameTime);
    }

}
