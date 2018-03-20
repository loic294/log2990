import { Component } from "@angular/core";

import { ITrackInfo } from "../../../../../server/app/models/trackInfo";
import { TrackInformationService } from "../../../../../server/app/services/trackInformation/trackInformationService"; // axios cote serveur
// import { TrackInformationService } from "../track-services/track-information.service";  // http cote client

@Component({
    selector: "app-track-information",
    templateUrl: "./track-information.component.html",
    styleUrls: ["./track-information.component.css"]
})
export class TrackInformationComponent {

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
            const temp: String[] = data;
            this._currentTrack = {name: temp[0].name, type: temp[0].type,
                                  description: temp[0].description, timesPlayed: temp[0].timesPlayed};
            console.log(this._currentTrack);
        });

    }

    public putTrack(trackName: String, trackType: String, trackDesc: String, played: Number): void {
        const track: ITrackInfo = {name: trackName, type: trackType, description: trackDesc, timesPlayed: played};
        this._trackInfo.putTrack(track);
    }

    public deleteTrack(trackName: String): void {
        this._trackInfo.deleteTrack(trackName);
    }

}
