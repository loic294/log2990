
import { Document, Schema} from "mongoose";
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
  createdAt: String,
  players: String,
  difficulty: String
});

export default mongoose.model<ITrackInfo>("tracks", trackSchema);
