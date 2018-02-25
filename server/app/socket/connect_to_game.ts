import Game, {IGameModel} from "../models/game";

const joinFirstPlayer: Function = async (socket: any, game: IGameModel, room: string, value: string): Promise<void> => {
    socket.join(room);
    await Game.findOneAndUpdate({ name: game.name}, { players: [value] })
    socket.emit("connected_to_game", JSON.stringify({
        game
    }));
};

const joinSecondPlayer: Function = async (socket: any, game: IGameModel, room: string, value: string): Promise<void> => {
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

export default (socket: any) => {

    socket.on("connect_to_game", async (data: string) => {
        const { gameId: room, value }: { gameId: string, value: string} = JSON.parse(data);
        const game: IGameModel = await Game.findOne({
            name: room
        });

        if (game.players.length === 0) {
            joinFirstPlayer(socket, game, room, value);
        } else if (game.players.length === 1) {
            joinSecondPlayer(socket, game, room, value);
        } else {
            console.log("Already 2 players");
        }

        socket.on("highligth_cell", (content: string) => {
            socket.to(room).emit("highligth_cell_in_color", content);
        });

        socket.on("disconnect", async () => {
            await game.remove();
            console.log("disconnect", game);
        });
    });
};
