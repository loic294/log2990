import Game, { IGameModel } from "../models/game";

export default (socket: any) => {
    socket.on("get_games", async (difficulty: String): Promise<void> => {
        const games: IGameModel[] = await Game.find({
            $and: [
                {"players.0": { "$exists": true }},
                {"players.1": { "$exists": false }},
                {"difficulty": {"$eq": difficulty}
            }]
        });
        socket.emit("add_games", games);
    });
};
