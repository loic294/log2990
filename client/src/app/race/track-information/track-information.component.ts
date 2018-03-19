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

    public constructor(private _trackInfo: TrackInformationService) {
        this._tracks = new Array();
    }

    public getTracksList(): void {
        this._trackInfo.getTracksList().then((data) => {
            this._tracks = data;
        });
    }

    public getTrackInfo(trackName: String): void {
       this._trackInfo.getTrackInfo(trackName).then((data) => {
            console.log(data);
        });

    }

    public putTrack(trackName: String, trackType: String, trackDesc: String, played: Number): void {
        /*const track: ITrackInfo {name: trackName}
        this._trackInfo.putTrack*/
    }

    public ngOnInit(): void {
    }

}
