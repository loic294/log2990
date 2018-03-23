import { Component, OnInit } from "@angular/core";

import { ITrack } from "../../../../../server/app/models/trackInfo";
import { TrackInformationService } from "../../../../../server/app/services/trackInformation/trackInformationService";
import { CommunicationService } from "../communicationService";

@Component({
    selector: "app-track-information",
    templateUrl: "./track-information.component.html",
    styleUrls: ["./track-information.component.css"]
})
export class TrackInformationComponent implements OnInit {

    private _tracks: Array<String>;
    private _currentTrack: ITrack;

    public constructor(private _trackInfo: TrackInformationService, public _trackCommunication: CommunicationService) {}

    public async getTracksList(): Promise<void> {
        this._trackInfo.getTracks("all").then((data) => {
            this._tracks = JSON.parse(data.toString());
        }).catch((error) => {
            throw error;
        });
    }

    public async getTrackInfo(trackName: String): Promise<void> {
        this._trackInfo.getTracks(trackName).then((data) => {
            const tempArray: Array<ITrack> = JSON.parse(data.toString());
            this._currentTrack = tempArray[0];
            this.loadTrack();
        }).catch((error) => {
            throw error;
        });
    }

    private loadTrack(): void {
        this._trackCommunication.sendTrack(this._currentTrack);
    }

    public get tracks(): Array<String> {
        return this._tracks;
    }

    public get track(): ITrack {
        return this._currentTrack;
    }

    public ngOnInit(): void {
        this.getTracksList().catch((error) => {
            throw error;
        });
    }

}
