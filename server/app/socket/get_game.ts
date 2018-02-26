// tslint:disable:await-promise
import Game, { IGame } from "../models/game";

// Les types sont dans @types dans node modules mais Typescript n'est pas capable des lires.
// tslint:disable-next-line:no-any
export default (socket: any) => {
    socket.on("get_games", async (): Promise<void> => {
        const games: IGame[] = await Game.find({
            $and: [
                {"players.0": { "$exists": true }},
                {"players.1": { "$exists": false }
            }]
        });
        socket.emit("add_games", games);
    });
};
