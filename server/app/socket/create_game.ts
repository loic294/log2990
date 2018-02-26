import Game, { IGameModel } from "../models/game";
import { Difficulty } from "../services/gridGeneration/gridGeneration";
import { difficultyName } from "../../../common/grid/difficulties";

export default (socket: any) => {
    socket.on("create_game", async (data: string): Promise<void> => {
        const { gameId: room, difficulty: difficulty }: { gameId: string, difficulty: String } = JSON.parse(data);
        const game: IGameModel = new Game({
            name: room,
            createdAt: new Date(),
            players: [],
            difficulty: difficulty
        });
        await game.save();

        socket.emit("created_game", game);
        const count: number = await Game.count({name: room});
        console.log("created game in db ", count);
    });
};
