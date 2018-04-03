
import { Document, Schema } from "mongoose";
import mongoose from "../config/mongoose";

export interface ITrack {
    name?: String;
    type?: String;
    description?: String;
    timesPlayed?: number;
    vertice?: Array<Array<number>>;
    completedTimes?: Array<string>;
}

export interface ITrackInfo extends Document {
    name: String;
    type: String;
    description: String;
    timesPlayed: number;
    vertice: Array<Array<number>>;
    completedTimes: Array<string>;
}

export const trackSchema: Schema = new Schema({
    name: String,
    type: String,
    description: String,
    timesPlayed: Number,
    vertice: Array<Array<Number>>(),
    completedTimes: Array<string>()
});

export default mongoose.model<ITrackInfo>("Track", trackSchema);
