import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { ITrackInfo } from "../../../../../server/app/models/trackInfo";

@Injectable()
export class TrackInformationService {

    public constructor(private http: HttpClient) { }

    public getTracksList(): Promise<String[]> {
        let tracks: Promise<String[]>;
        this.http.get("http://localhost:3000/race/tracks?name=all").subscribe((res: Response) => {
            tracks = res.json();
        });

        return tracks;
    }

    public getTrackInfo(trackName: String): Promise<ITrackInfo> {
        let track: Promise<ITrackInfo>;
        this.http.get("http://localhost:3000/race/tracks?name=" + trackName).subscribe((res: Response) => {
            track = res.json();
        });

        return track;
    }

    public putTrack(track: ITrackInfo): void {

        const body: Object = { name: track.name, type: track.type, description: track.description, timesPlayed: track.timesPlayed };
        this.http.post("http://localhost:3000/race/tracks", body).subscribe((res: Response) => {
        });
    }

}
