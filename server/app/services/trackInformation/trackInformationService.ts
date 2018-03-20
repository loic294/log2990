
import axios, { AxiosResponse } from "axios";

import { ITrackInfo } from "../../models/trackInfo";

export class TrackInformationService {

    public async getTracksList(): Promise<AxiosResponse> {
        try {
            const response: AxiosResponse = await axios.get("http://localhost:3000/race/tracks?name=all");

            return response.data;
        } catch (err) {
            throw err;
        }
    }

    public async getTrackInfo(trackName: String): Promise<AxiosResponse> {
        try {
            const response: AxiosResponse = await axios.get("http://localhost:3000/race/tracks?name=" + trackName);

            return response.data;
        } catch (err) {
            throw err;
        }
    }

    public putTrack(track: ITrackInfo): void {
        try {
            const body: Object = { name: track.name, type: track.type, description: track.description, timesPlayed: track.timesPlayed };
            axios.post("http://localhost:3000/race/tracks", body);
        } catch (err) {
            throw err;
        }
    }

    public deleteTrack(trackName: String): void {
        try {
            axios.delete("http://localhost:3000/race/tracks?name=" + trackName);
        } catch (err) {
            throw err;
        }
    }

}
