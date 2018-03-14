import { Component, OnInit } from "@angular/core";
import { Http, Response } from "@angular/http";

import { ITrackInfo } from "../../../../../server/app/models/trackInfo";
// import * as TrackInformationService from "../../../../../server/app/services/trackInformation/trackInformation";

@Component({
    selector: "app-track-information",
    templateUrl: "./track-information.component.html",
    styleUrls: ["./track-information.component.css"]
})
export class TrackInformationComponent implements OnInit {

    private _tracks: Array<ITrackInfo>;

    public constructor(private http: Http) {
        this._tracks = new Array();
     }

    public updateTracks(): void {
        let tracks: Object[] = new Array();
        this.http.get("/").subscribe((res: Response) => {
            tracks = res.json();
            // console.log(tracks);
        });
    }

    public putTrack(): void {
        this.http.post("/tracks/new", "gabbbb");
    }

    public getTrackInfo(trackName: String): ITrackInfo {
        this.updateTracks();

        let returnTrack: ITrackInfo;

        for (const track of this._tracks) {
            if (track.name === trackName) {
                returnTrack = track;
                break;
            }
        }

        return returnTrack;
    }

    public getTrackList(): Array<String> {
        this.updateTracks();

        const trackNames: Array<String> = new Array();

        for (const track of this._tracks) {
            trackNames.push(track.name);
        }

        return trackNames;
    }

    public ngOnInit(): void {
    }

}
