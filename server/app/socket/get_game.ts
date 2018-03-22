// tslint:disable:await-promise
import Game, { IGameModel } from "../models/game";
import { Socket } from "./socket.io-types";

export default (socket: Socket) => {
    socket.on("get_games", async (difficulty: String): Promise<void> => {
        const games: IGameModel[] = await Game.find({
            $and: [
                {"players": {"$size": 1}},
                {"difficulty": {"$eq": difficulty}
            }]
        });
        socket.emit("add_games", games);
    });
};
