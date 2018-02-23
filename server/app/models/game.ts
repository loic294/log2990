import { Document, Schema} from "mongoose";
import mongoose from "../config/mongoose";

export interface IGame {
  name?: String;
  createdAt?: Date;
  players?: Array<String>;
}

export interface IGameModel extends Document {
    name: String;
    createdAt: Date;
    players: Array<String>;
}

export const gameSchema: Schema = new Schema({
  name: String,
  createdAt: Date,
  players: [String]
});

export default mongoose.model<IGameModel>("Game", gameSchema);
