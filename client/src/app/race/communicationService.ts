import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import { ITrack } from "../../../../server/app/models/trackInfo";

@Injectable()
export class CommunicationService {
    private _track: Observable<ITrack>;
    private _trackSubject: Subject<ITrack> = new Subject<ITrack>();

    public constructor() {
        this._track = this._trackSubject.asObservable();
    }

    public get track(): Observable<ITrack> {
        return this._track;
    }

    public sendTrack(track: ITrack): void {
        this._trackSubject.next(track);
    }

}
