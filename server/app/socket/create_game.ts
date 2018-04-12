import Game, { IGameModel } from "../models/game";
import { Socket } from "./socket.io-types";
import { SocketMessage } from "../../../common/communication/message";

interface GameData {
    gameId: string;
    difficulty: String;
}

export default (socket: Socket) => {
    socket.on(SocketMessage.createGame, async (data: string): Promise<void> => {

        const { gameId: room, difficulty: difficulty }: GameData = JSON.parse(data);
        const game: IGameModel = new Game({
            name: room,
            createdAt: new Date(),
            players: [],
            score: [0, 0],
            difficulty: difficulty
        });
        await game.save();

        socket.emit(SocketMessage.createdGame, game);
    });
};
