import Game, { IGameModel } from "../models/game";

export default (socket: any) => {
    socket.on("get_games", async (): Promise<void> => {
        const games: IGameModel[] = await Game.find({
            $and: [
                {"players.0": { "$exists": true }},
                {"players.1": { "$exists": false }
            }]
        });
        socket.emit("add_games", games);
    });
};
