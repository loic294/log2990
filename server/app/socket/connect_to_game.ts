// tslint:disable:await-promise
import Game, {IGameModel} from "../models/game";
import { Socket } from "./socket.io-types";
import { SocketMessage } from "../../../common/communication/message";

interface DataReceived {
    gameId: string;
    value: string;
}

const joinFirstPlayer: Function = async (socket: Socket, game: IGameModel, room: string, value: string): Promise<void> => {
    socket.join(room);

    await Game.findOneAndUpdate({ name: game.name}, { players: [value] }, {new: true});
    socket.emit(SocketMessage.connectedToGame, JSON.stringify({
        game
    }));
};

const joinSecondPlayer: Function = async (socket: Socket, game: IGameModel, room: string, value: string): Promise<void> => {
    socket.join(room);

    game = await Game.findOneAndUpdate({ name: game.name}, { players: [game.players[0], value] }, {new: true});

    socket.server.in(room).emit(SocketMessage.secondPlayerJoined, game);
    socket.broadcast.server.to(room).emit(SocketMessage.readyToSync, game);

    socket.emit(SocketMessage.connectedToGame, JSON.stringify({
        game
    }));
};

const syncGrid: Function = async (socket: Socket, room: string): Promise<void> => {
    socket.join(room);

    socket.on(SocketMessage.syncGrid, async (content: string) => {
        socket.broadcast.server.to(room).emit(SocketMessage.syncGridSend, content);
    });

};

const rematch: Function = async (socket: Socket, data: string, game: IGameModel): Promise<void> => {
        const { gameId: room }: DataReceived = JSON.parse(data);

        socket.on(SocketMessage.requestRematch, async (content: string) => {
            socket.to(room).emit(SocketMessage.rematchInvitation, content);
        });

        socket.on(SocketMessage.acceptRematch, async (content: string) => {
            socket.to(room).emit(SocketMessage.rematchAccepted, content);
        });

};

const validation: Function = async (socket: Socket, data: string, game: IGameModel): Promise<void> => {
    const { gameId: room }: DataReceived = JSON.parse(data);

    socket.on(SocketMessage.syncWord, (content: string) => {
        socket.to(room).emit(SocketMessage.receiveWord, content);
    });

    socket.on(SocketMessage.sendValidation, (content: string) => {
        socket.to(room).emit(SocketMessage.pushValidation, content);
    });

};

export default (socket: Socket) => {
    socket.on(SocketMessage.connectToGame, async (data: string) => {
        const { gameId: room, value }: DataReceived = JSON.parse(data);
        const game: IGameModel = await Game.findOne({
            name: room
        });
        if (game.players.length === 0) {
            joinFirstPlayer(socket, game, room, value);
        } else if (game.players.length === 1) {
            joinSecondPlayer(socket, game, room, value);
        }

        socket.on(SocketMessage.disconnect, async (content: boolean) => {
            socket.to(room).emit(SocketMessage.opponentDisconnected, true);
            await game.remove();
        });

        rematch(socket, data);

        validation(socket, data);

        syncGrid(socket, room);

    });
};
