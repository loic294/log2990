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
    private _timesPlayed: number;
    private _vertice: Array<Array<Number>>;

    public constructor(private _trackInfo: TrackInformationService) {
        this._tracks = new Array();
        this._name = "";
        this._type = "";
        this._description = "";
        this._timesPlayed = 0;
    }

    public getTracksList(): void {
        this._trackInfo.getTracks("all").then((data) => {
            this._tracks = JSON.parse(data.toString());
        }).catch((error) => {
            throw error;
        });
    }

    public getTrackInfo(trackName: String): void {
        this._trackInfo.getTracks(trackName).then((data) => {
            const tempArray: Array<ITrackInfo> = JSON.parse(data.toString());
            this._currentTrack = tempArray[0];
        }).catch((error) => {
            throw error;
        });
    }

    public putTrack(): void {
        const track: Object = {name: this._name, type: this._type, description: this._description,
                               timesPlayed: this._timesPlayed, vertice: this._vertice};
        this._trackInfo.putTrack(track).then(() => {
            this.getTracksList();
        }).catch((error) => {
            throw error;
        });
    }

    public deleteTrack(): void {
        this._trackInfo.deleteTrack(this._currentTrack.name).then(() => {
            this._currentTrack = null;
            this.getTracksList();
        }).catch((error) => {
            throw error;
        });
    }

    public set name(name: String) {
        this._name = name;
    }

    public set type(type: String) {
        this._type = type;
    }

    public set description(description: String) {
        this._description = description;
    }

    public set timesPlayed(timesPlayed: number) {
        this._timesPlayed = timesPlayed;
    }

    public set vertice(vertice: Array<Array<Number>>) {
        this._vertice = vertice;
    }

    public get currentTrack(): ITrackInfo {
        return this._currentTrack;
    }

    public get tracks(): Array<String> {
        return this._tracks;
    }

    public ngOnInit(): void {
        this.getTracksList();
    }

}
