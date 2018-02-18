import * as mongoose from "mongoose";

const gameSchema: mongoose.Schema = new mongoose.Schema({
    gameId: String,
    players: Number,
    difficulty: String
});

export const gameModel: mongoose.Model<mongoose.Document> = mongoose.model("gameModel", gameSchema);
