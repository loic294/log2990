
import axios, { AxiosResponse } from "axios";

export class TrackInformationService {

    public async getTracks(trackName: String): Promise<String> {
        try {
            const response: AxiosResponse = await axios.get("http://localhost:3000/race/tracks?name=" + trackName);

            return JSON.stringify(response.data);
        } catch (err) {
            throw err;
        }
    }

    public async putTrack(track: Object): Promise<void> {
        try {
            await axios.post("http://localhost:3000/race/tracks", track);

        } catch (err) {
            throw err;
        }
    }

    public async deleteTrack(trackName: String): Promise<void> {
        try {
            await axios.delete("http://localhost:3000/race/tracks?name=" + trackName);
        } catch (err) {
            throw err;
        }
    }

}
