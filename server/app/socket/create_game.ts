import Game, { IGameModel } from "../models/game";

// Les types sont dans @types dans node modules mais Typescript n'est pas capable des lires.
// tslint:disable-next-line:no-any
export default (socket: any) => {
    socket.on("create_game", async (data: string): Promise<void> => {
        // tslint:disable-next-line:no-use-before-declare
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
