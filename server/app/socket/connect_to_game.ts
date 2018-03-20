// tslint:disable:await-promise
import Game, {IGameModel} from "../models/game";
import { Socket } from "./socket.io-types";

interface DataReceived {
    gameId: string;
    value: string;
}

const joinFirstPlayer: Function = async (socket: Socket, game: IGameModel, room: string, value: string): Promise<void> => {
    socket.join(room);

    await Game.findOneAndUpdate({ name: game.name}, { players: [value] }, {new: true});
    socket.emit("connected_to_game", JSON.stringify({
        game
    }));
};

const joinSecondPlayer: Function = async (socket: Socket, game: IGameModel, room: string, value: string): Promise<void> => {
    socket.join(room);

    game = await Game.findOneAndUpdate({ name: game.name}, { players: [game.players[0], value] }, {new: true});

    socket.server.in(room).emit("second_player_joined", game);

    socket.emit("connected_to_game", JSON.stringify({
        game
    }));
};

const pointFirstPlayer: Function = async (socket: Socket, game: IGameModel, room: string): Promise<void> => {
    socket.join(room);

    game = await Game.findOneAndUpdate({ name: game.name}, { players: [game.score[0], game.score[0]++] }, {new: true});
};

const pointSecondPlayer: Function = async (socket: Socket, game: IGameModel, room: string): Promise<void> => {
    socket.join(room);

    game = await Game.findOneAndUpdate({ name: game.name}, { players: [game.score[1], game.score[0]++] }, {new: true});
};

const validation: Function = async (socket: Socket, data: string, game: IGameModel): Promise<void> => {
        const { gameId: room }: DataReceived = JSON.parse(data);
        socket.on("sync_word", (content: string) => {
            socket.to(room).emit("receive_word", content);
        });

        socket.on("send_validation", (content: string) => {
            socket.to(room).emit("push_validation", content);
        });

        socket.on("disconnect", async (content: boolean) => {
            socket.to(room).emit("opponent_disconnected", true);
            await game.remove();
        });

    };

// **********************************************************************************************************************
// **********************************************************************************************************************
// **********************************************************************************************************************
// tslint:disable-next-line:max-func-body-length ************************************************************************
export default (socket: Socket) => {
    // ******************************************************************************************************************
    // ******************************************************************************************************************
    // ******************************************************************************************************************
    // tslint:disable-next-line:max-func-body-length ********************************************************************
    socket.on("connect_to_game", async (data: string) => {
        const { gameId: room, value }: DataReceived = JSON.parse(data);
        const game: IGameModel = await Game.findOne({
            name: room
        });
        if (game.players.length === 0) {
            joinFirstPlayer(socket, game, room, value);
        } else if (game.players.length === 1) {
            joinSecondPlayer(socket, game, room, value);
        }

        validation(socket, data);

        // socket.on("sync_word", (content: string) => {
        //     socket.to(room).emit("receive_word", content);
        // });

        // socket.on("send_validation", (content: string) => {
        //     socket.to(room).emit("push_validation", content);
        // });

        // socket.on("disconnect", async (content: boolean) => {
        //     socket.to(room).emit("opponent_disconnected", true);
        //     await game.remove();
        // });

        socket.on("request_rematch", async (content: string) => {
            socket.to(room).emit("rematch_invitation", content);
        });

        socket.on("accept_rematch", async (content: string) => {
            socket.to(room).emit("rematch_accepted", content);
        });

        socket.on("word_validated", async (content: string) => {
            if (content === "player1") {
                pointFirstPlayer(socket, game, room);
            } else if (content === "player2") {
                pointSecondPlayer(socket, game, room);
            }
        });
    });
};
