
import { Document, Schema } from "mongoose";
import mongoose from "../config/mongoose";

export interface ITrack {
    name?: String;
    type?: String;
    description?: String;
    timesPlayed?: number;
}

export interface ITrackInfo extends Document {
    name: String;
    type: String;
    description: String;
    timesPlayed: number;
}

export const trackSchema: Schema = new Schema({
    name: String,
    type: String,
    description: String,
    timesPlayed: Number
});

export default mongoose.model<ITrackInfo>("Track", trackSchema);
