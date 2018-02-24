import Game, { IGameModel } from "../models/game";

export default (socket: any) => {
    socket.on("create_game", async (data: string): Promise<void> => {
        const { gameId: room }: { gameId: string, value: string } = JSON.parse(data);
        const game: IGameModel = new Game({
            name: room,
            createdAt: new Date(),
            players: []
        });
        await game.save();

        socket.emit("created_game", game);
        const count: number = await Game.count({name: room});
        console.log("created game in db ", count);
    });
};
