
import { Document, Schema } from "mongoose";
import mongoose from "../config/mongoose";
import { PlayerStats } from "../../../common/race/playerStats";

export interface ITrack {
    name?: String;
    type?: String;
    description?: String;
    timesPlayed?: number;
    vertice?: Array<Array<number>>;
    completedTimes?: Array<PlayerStats>;
}

export interface ITrackInfo extends Document {
    name: String;
    type: String;
    description: String;
    timesPlayed: number;
    vertice: Array<Array<number>>;
    completedTimes: Array<PlayerStats>;
}

export const trackSchema: Schema = new Schema({
    name: String,
    type: String,
    description: String,
    timesPlayed: Number,
    vertice: Array<Array<Number>>(),
    completedTimes: Array<PlayerStats>()
});

export default mongoose.model<ITrackInfo>("Track", trackSchema);
