// tslint:disable:await-promise
import Game, { IGameModel } from "../models/game";
import { Socket } from "./socket.io-types";
import { SocketMessage } from "../../../common/communication/message";

export default (socket: Socket) => {
    socket.on(SocketMessage.getGames, async (difficulty: String): Promise<void> => {
        const games: IGameModel[] = await Game.find({
            $and: [
                {"players": {"$size": 1}},
                {"difficulty": {"$eq": difficulty}
            }]
        });
        socket.emit(SocketMessage.addGame, games);
    });
};
