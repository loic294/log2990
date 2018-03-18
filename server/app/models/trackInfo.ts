
<<<<<<< HEAD
import { Document, Schema } from "mongoose";
import mongoose from "../config/mongoose";

export interface ITrack {
    name?: String;
    type?: String;
    description?: String;
    timesPlayed?: number;
=======
import { Document, Schema} from "mongoose";
import mongoose from "../config/mongoose";

export interface ITrack {
  name?: String;
  type?: String;
  description?: String;
  timesPlayed?: number;
>>>>>>> 9278d1d65793fd789f4d94e156bbcf060598b2d1
}

export interface ITrackInfo extends Document {
    name: String;
    type: String;
    description: String;
    timesPlayed: number;
}

export const trackSchema: Schema = new Schema({
<<<<<<< HEAD
    name: String,
    type: String,
    description: String,
    timesPlayed: Number
});

export default mongoose.model<ITrackInfo>("Track", trackSchema);
=======
  name: String,
  createdAt: String,
  players: String,
  difficulty: String
});

export default mongoose.model<ITrackInfo>("tracks", trackSchema);
>>>>>>> 9278d1d65793fd789f4d94e156bbcf060598b2d1
