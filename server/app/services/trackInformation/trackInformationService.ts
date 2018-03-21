
import axios, { AxiosResponse } from "axios";

let promise: Promise<AxiosResponse>;

export class TrackInformationService {

    public async getTracks(trackName: String): Promise<String> {
        try {
            promise = axios.get("http://localhost:3000/race/tracks?name=" + trackName);

            return JSON.stringify(promise);
        } catch (err) {
            throw err;
        }
    }

    public async putTrack(track: Object): Promise<void> {
        try {
            promise = axios.post("http://localhost:3000/race/tracks", track).then();

        } catch (err) {
            throw err;
        }
    }

    public async deleteTrack(trackName: String): Promise<void> {
        try {
            promise = axios.delete("http://localhost:3000/race/tracks?name=" + trackName).then();
        } catch (err) {
            throw err;
        }
    }

}
