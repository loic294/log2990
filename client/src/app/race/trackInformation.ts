import { TrackInformationService } from "../../../../server/app/services/trackInformation/trackInformationService";
import { ITrack } from "../../../../server/app/models/trackInfo";

export class TrackInformation {

    private _currentTrack: ITrack;
    private _trackNames: Array<String>;

    public constructor(private _trackService: TrackInformationService = new TrackInformationService()) {}

    public getTracksList(): void {
        this._trackService.getTracks("all").then((data) => {
            const tempArray: Array<ITrack> = JSON.parse(data.toString());
            this._trackNames = new Array();
            for (const track of tempArray) {
                this._trackNames.push(track.name);
            }
        }).catch((error) => {
            throw error;
        });
    }

    public async getTrackInfo(trackName: String): Promise<void> {

        await this._trackService.getTracks(trackName).then((data) => {
            const tempArray: Array<ITrack> = JSON.parse(data.toString());
            this._currentTrack = tempArray[0];
        }).catch((error) => {
            throw error;
        });
    }

    public async deleteTrack(): Promise<void> {
        await this._trackService.deleteTrack(this._currentTrack.name);
        this.getTracksList();
    }

    public async patchTrack(): Promise<void> {
        await this._trackService.patchTrack(this._currentTrack.name, this._currentTrack);
    }

    public async putTrack(): Promise<void> {
        await this._trackService.putTrack(this._currentTrack);
        this.getTracksList();
    }

    public resetTrack(): void {
        this._currentTrack = {name: "", type: "", description: "", timesPlayed: 0, vertice: new Array(), completedTimes: new Array()};
    }

    public get tracks(): Array<String> {
        return this._trackNames;
    }

    public set tracks(tracks: Array<String>) {
        this._trackNames = tracks;
    }

    public get track(): ITrack {
        return this._currentTrack;
    }

    public set track(track: ITrack) {
        this._currentTrack = track;
    }

}
