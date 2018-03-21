
import axios from "axios";
import { ITrack } from "../../models/trackInfo";

export class TrackInformationService {

    public async getTracks(trackName: String): Promise<String> {
        try {
            const { data }: { data: Array<ITrack> } = await axios.get("http://localhost:3000/race/tracks?name=" + trackName);

            return JSON.stringify(data);
        } catch (err) {
            throw err;
        }
    }

    public async putTrack(track: ITrack): Promise<void> {
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
