import { TrackInformationService } from "../../../../server/app/services/trackInformation/trackInformationService";
import { ITrack } from "../../../../server/app/models/trackInfo";

export class TrackInformation {

    private _currentTrack: ITrack;
    private _trackNames: Array<String>;

    public constructor(private _trackService: TrackInformationService = new TrackInformationService()) {}

    public async getTracksList(): Promise<void> {
        await this._trackService.getTracks("all").then((data) => {
            this._trackNames = JSON.parse(data.toString());
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
        this._currentTrack = {name: "", type: "", description: "", timesPlayed: 0, vertice: new Array()};
    }

    public get tracks(): Array<String> {
        return this._trackNames;
    }

    public get track(): ITrack {
        return this._currentTrack;
    }
}
