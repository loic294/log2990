import { Injectable } from "@angular/core";
import { IGameInformation } from "../trackProgressionService";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { PlayerStats } from "../../../../../common/race/playerStats";
import { TrackInformation } from "../trackInformation";

@Injectable()
export class ResultsService {

    private _game: Observable<IGameInformation>;
    private _gameSubject: Subject<IGameInformation> = new Subject<IGameInformation>();

    private _times: Observable<Array<PlayerStats>>;
    private _timesSubject: Subject<Array<PlayerStats>> = new Subject<Array<PlayerStats>>();
    private _trackInformation: Observable<TrackInformation>;
    private _trackInformationSubject: Subject<TrackInformation> = new Subject<TrackInformation>();

    private _shouldRestart: Observable<boolean>;
    private _shouldRestartSubject: Subject<boolean> = new Subject<boolean>();

    public constructor() {
        this._game = this._gameSubject.asObservable();
        this._times = this._timesSubject.asObservable();
        this._trackInformation = this._trackInformationSubject.asObservable();
        this._shouldRestart = this._shouldRestartSubject.asObservable();
    }

    public get game(): Observable<IGameInformation> {
        return this._game;
    }

    public selectGame(game: IGameInformation): void {
        this._gameSubject.next(game);
    }

    public get trackInformation(): Observable<TrackInformation> {
        return this._trackInformation;
    }

    public selectTrackInformation(track: TrackInformation): void {
        this._trackInformationSubject.next(track);
    }

    public get trackTimes(): Observable<Array<PlayerStats>> {
        return this._times;
    }

    public selectTrackTimes(times: Array<PlayerStats>): void {
        this._timesSubject.next(times);
    }

    public get restart(): Observable<boolean> {
        return this._shouldRestart;
    }

    public restartRace(shouldRestart: boolean): void {
        this._shouldRestartSubject.next(shouldRestart);
    }

}
