
import axios, { AxiosResponse } from "axios";

export class TrackInformationService {

    public async getTracksList(): Promise<String> {
        try {
            const response: AxiosResponse = await axios.get("http://localhost:3000/race/tracks?name=all");

            return JSON.stringify(response.data);
        } catch (err) {
            throw err;
        }
    }

    public async getTrackInfo(trackName: String): Promise<String> {
        try {
            const response: AxiosResponse = await axios.get("http://localhost:3000/race/tracks?name=" + trackName);

            return JSON.stringify(response.data);
        } catch (err) {
            throw err;
        }
    }

    public putTrack(track: Object): void {
        try {
            axios.post("http://localhost:3000/race/tracks", track);
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
