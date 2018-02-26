import { Document, Schema} from "mongoose";
import mongoose from "../config/mongoose";
import { Difficulty } from "./../../../common/grid/difficulties";

export interface IGame {
  name?: String;
  createdAt?: Date;
  players?: Array<String>;
  difficulty?: String;
}

export interface IGameModel extends Document {
    name: String;
    createdAt: Date;
    players: Array<String>;
    difficulty: String;
}

export const gameSchema: Schema = new Schema({
  name: String,
  createdAt: Date,
  players: [String],
  difficulty: String
});

export default mongoose.model<IGameModel>("Game", gameSchema);
