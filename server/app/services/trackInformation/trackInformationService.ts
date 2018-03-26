// tslint:disable:await-promise
// lint rule await-promise incompatible avec Axios
import axios from "axios";
import { ITrack } from "../../models/trackInfo";

export class TrackInformationService {

    public async getTracks(trackName: String): Promise<String> {
        try {
            const { data }: { data: Array<ITrack> } = await axios.get("http://localhost:3000/race/tracks?name=" + trackName);

            return JSON.stringify(data);
        } catch (error) {
            throw error;
        }

    }

    public async putTrack(track: ITrack): Promise<void> {
        try {
            await axios.post("http://localhost:3000/race/tracks", track);
        } catch (error) {
            throw error;
        }

    }

    public async deleteTrack(trackName: String): Promise<void> {
        try {
            await axios.delete("http://localhost:3000/race/tracks?name=" + trackName);
        } catch (error) {
            throw error;
        }

    }

    public async patchTrack(trackName: String, newInformation: ITrack): Promise<void> {
        try {
            await axios.patch("http://localhost:3000/race/tracks?name=" + trackName, newInformation);
        } catch (error) {
            throw error;
        }

    }

}
