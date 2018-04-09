import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";

export interface IGameInformation {
    gameTime: String;
    lapTimes: Array<String>;
    currentLap: number;
    gameIsFinished: boolean;
    botTimes: Array<Array<String>>;
}

@Injectable()
export class TrackProgressionService {
    private _game: Observable<IGameInformation>;
    private _gameSubject: Subject<IGameInformation> = new Subject<IGameInformation>();

    public constructor() {
        this._game = this._gameSubject.asObservable();
    }

    public get game(): Observable<IGameInformation> {
        return this._game;
    }

    public sendGameProgress(game: IGameInformation): void {
        this._gameSubject.next(game);
    }

}
