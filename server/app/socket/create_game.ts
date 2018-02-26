import Game, { IGameModel } from "../models/game";
import { Difficulty } from "../services/gridGeneration/gridGeneration";
import { difficultyName } from "../../../common/grid/difficulties";

interface DataReceived {
    gameId: string;
    value: string;
}

// Les types sont dans @types dans node modules mais Typescript n'est pas capable des lires.
// tslint:disable-next-line:no-any
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
    });
};
