import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import Track, { ITrackInfo } from "../../../../../server/app/models/trackInfo";

@Component({
    selector: "app-track-information",
    templateUrl: "./track-information.component.html",
    styleUrls: ["./track-information.component.css"]
})
export class TrackInformationComponent implements OnInit {

    private _tracks: Array<String>;

    public constructor(private http: HttpClient) {
        this._tracks = new Array();
     }

    public getTracksList(): void {
        const tracks: String[] = new Array();
        this.http.get("http://localhost:3000/race/tracks?name=all").subscribe((res: Response) => {
            tracks.push(res.toString());
            this._tracks = tracks;
        });
    }

    public getTrackInfo( trackName: String ): void {
        this.http.get("http://localhost:3000/race/tracks?name=" + trackName).subscribe((res: Response) => {
            console.log(res);
        });
    }

    public putTrack(trackName: String, trackType: String, trackDesc: String, played: Number): void {

        const body: Object = {name: trackName, type: trackType, description: trackDesc, timesPlayed: played};
        this.http.post("http://localhost:3000/race/tracks", body).subscribe((res: Response) => {
            console.log(res);
        });
    }

    public ngOnInit(): void {
    }

}
