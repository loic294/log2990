// tslint:disable:await-promise
import Game, {IGameModel} from "../models/game";
import { Socket } from "./socket.io-types";
interface DataReceived {
    gameId: string;
    value: string;
}

const joinFirstPlayer: Function = async (socket: Socket, game: IGameModel, room: string, value: string): Promise<void> => {
    socket.join(room);

    await Game.findOneAndUpdate({ name: game.name}, { players: [value] });
    socket.emit("connected_to_game", JSON.stringify({
        game
    }));
};

const joinSecondPlayer: Function = async (socket: Socket, game: IGameModel, room: string, value: string): Promise<void> => {
    socket.join(room);

    const dbGame: IGameModel = await Game.findOne({
        name: game.name
    });
    dbGame.players.push(value);
    await dbGame.save();

    socket.emit("connected_to_game", JSON.stringify({
        game: dbGame
    }));

    // SEND CONNECTED TO OTHER PLAYER
};

export default (socket: Socket) => {

    socket.on("connect_to_game", async (data: string) => {
        const { gameId: room, value }: DataReceived = JSON.parse(data);
        const game: IGameModel = await Game.findOne({
            name: room
        });

        if (game.players.length === 0) {
            joinFirstPlayer(socket, game, room, value);
        } else if (game.players.length === 1) {
            joinSecondPlayer(socket, game, room, value);
            socket.to(room).emit("second_player_joined", value);
        }

        socket.on("sync_word", (content: string) => {
            socket.to(room).emit("receive_word", content);
        });

        socket.on("send_validation", (content: string) => {
            socket.to(room).emit("push_validation", content);
        });

        socket.on("disconnect", async () => {
            await game.remove();
        });
    });
};
