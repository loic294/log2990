import { Document, Schema} from "mongoose";
import mongoose from "../config/mongoose";

export interface IGame {
  name?: String;
  createdAt?: Date;
  players?: Array<String>;
  score?: Array<number>;
  difficulty?: String;
}

export interface IGameModel extends Document {
    name: String;
    createdAt: Date;
    players: Array<String>;
    score: Array<number>;
    difficulty: String;
}

export const gameSchema: Schema = new Schema({
  name: String,
  createdAt: Date,
  players: [String],
  score: [Number],
  difficulty: String
});

export default mongoose.model<IGameModel>("Game", gameSchema);
