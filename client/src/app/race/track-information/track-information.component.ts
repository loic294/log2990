import { Component, OnInit } from "@angular/core";

import { ITrackInfo } from "../../../../../server/app/models/trackInfo";
import { TrackInformationService } from "../../../../../server/app/services/trackInformation/trackInformationService";

@Component({
    selector: "app-track-information",
    templateUrl: "./track-information.component.html",
    styleUrls: ["./track-information.component.css"]
})
export class TrackInformationComponent implements OnInit {

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

    private getTracksList(): void {
        this._trackInfo.getTracksList().then((data) => {
            this._tracks = JSON.parse(data.toString());
        });
    }

    public getTrackInfo(trackName: String): void {
        this._trackInfo.getTrackInfo(trackName).then((data) => {
            const tempArray: Array<ITrackInfo> = JSON.parse(data.toString());
            this._currentTrack = tempArray[0];
        });
    }

    public putTrack(): void {
        const track: Object = {name: this._name, type: this._type, description: this._description, timesPlayed: this._timePlayed};
        this._trackInfo.putTrack(track);
        this.getTracksList();
    }

    public deleteTrack(): void {
        this._trackInfo.deleteTrack(this._currentTrack.name);
        this._currentTrack = null;
        this.getTracksList();
    }

    public ngOnInit(): void {
        this.getTracksList();
    }

}
