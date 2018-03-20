import { Component } from "@angular/core";

import { ITrackInfo } from "../../../../../server/app/models/trackInfo";
import { TrackInformationService } from "../../../../../server/app/services/trackInformation/trackInformationService";

@Component({
    selector: "app-track-information",
    templateUrl: "./track-information.component.html",
    styleUrls: ["./track-information.component.css"]
})
export class TrackInformationComponent {

    private _tracks: Array<String>;
    private _currentTrack: ITrackInfo;
    private _name: String;
    private _type: String;
    private _description: String;
    private _timePlayed: number;

    public constructor(private _trackInfo: TrackInformationService) {
        this._tracks = new Array();
        this._name = "";
        this._type = "";
        this._description = "";
        this._timePlayed = 0;
    }

    public getTracksList(): void {
        this._trackInfo.getTracksList().then((data) => {
            this._tracks = JSON.parse(data.toString());
        });
    }

    public getTrackInfo(): void {
        this._trackInfo.getTrackInfo(this._name).then((data) => {
            this._currentTrack = JSON.parse(data.toString());
        });
    }

    public putTrack(): void {
        const track: Object = {name: this._name, type: this._type, description: this._description, timesPlayed: this._timePlayed};
        this._trackInfo.putTrack(track);
    }

    public deleteTrack(): void {
        this._trackInfo.deleteTrack(this._name);
    }

}
