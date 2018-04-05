import { Injectable } from "@angular/core";
import { IGameInformation } from "../trackProgressionService";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class ResultsService {

    private _game: Observable<IGameInformation>;
    private _gameSubject: Subject<IGameInformation> = new Subject<IGameInformation>();

    public constructor() {
        this._game = this._gameSubject.asObservable();
    }

    public get game(): Observable<IGameInformation> {
        return this._game;
    }

    public selectGame(game: IGameInformation): void {
        this._gameSubject.next(game);
    }

}
