import { Injectable } from "@angular/core";
import { IGameInformation } from "../trackProgressionService";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class ResultsService {

    private _game: Observable<IGameInformation>;
    private _gameSubject: Subject<IGameInformation> = new Subject<IGameInformation>();

    private _times: Observable<Array<number>>;
    private _timesSubject: Subject<Array<number>> = new Subject<Array<number>>();

    public constructor() {
        this._game = this._gameSubject.asObservable();
        this._times = this._timesSubject.asObservable();
    }

    public get game(): Observable<IGameInformation> {
        return this._game;
    }

    public selectGame(game: IGameInformation): void {
        this._gameSubject.next(game);
    }

    public get trackTimes(): Observable<Array<number>> {
        return this._times;
    }

    public selectTrackTimes(times: Array<number>): void {
        this._timesSubject.next(times);
    }

}
