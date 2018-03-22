import { Component, OnInit } from "@angular/core";

import { ITrack } from "../../../../../server/app/models/trackInfo";
import { TrackInformationService } from "../../../../../server/app/services/trackInformation/trackInformationService";

@Component({
    selector: "app-track-information",
    templateUrl: "./track-information.component.html",
    styleUrls: ["./track-information.component.css"]
})
export class TrackInformationComponent implements OnInit {

    private _tracks: Array<String>;
    private _currentTrack: ITrack;

    public constructor(private _trackInfo: TrackInformationService) {
        this._tracks = new Array();
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
            const tempArray: Array<ITrack> = JSON.parse(data.toString());
            this._currentTrack = tempArray[0];
        }).catch((error) => {
            throw error;
        });
    }

    public ngOnInit(): void {
        this.getTracksList();
    }

}
