// tslint:disable:await-promise
// lint rule await-promise incompatible avec Axios
import axios from "axios";
import { ITrack } from "../../models/trackInfo";

export class TrackInformationService {

    public async getTracks(trackName: String): Promise<String> {
            const { data }: { data: Array<ITrack> } = await axios.get("http://localhost:3000/race/tracks?name=" + trackName);

            return JSON.stringify(data);
    }

    public async putTrack(track: ITrack): Promise<void> {
            await axios.post("http://localhost:3000/race/tracks", track);
    }

    public async deleteTrack(trackName: String): Promise<void> {
            await axios.delete("http://localhost:3000/race/tracks?name=" + trackName);
    }

    public async patchTrack(trackName: String, newInformation: ITrack): Promise<void> {
            await axios.patch("http://localhost:3000/race/tracks?name=" + trackName, newInformation);
    }

}
