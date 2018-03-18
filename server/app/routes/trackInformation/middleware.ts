import { Request, Response, NextFunction } from "express";
<<<<<<< HEAD
import Track, { ITrackInfo } from "../../models/trackInfo";
=======
>>>>>>> 9278d1d65793fd789f4d94e156bbcf060598b2d1

const ERR_500: number = 500;

export const obtainTracks: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

<<<<<<< HEAD
        const track: ITrackInfo[] = await Track.find({name: "trackName", type: "trackType"},
                                                     {_id: 0, name: 1, type: 1, description: 1, timesPlayed: 1});
        try {
            res.json(track[0]);
        } catch (err) {
            res.status(ERR_500).send(err.message);
        }
};

export const saveTrack: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const track: ITrackInfo = new Track({
            name: "trackName",
            type: "trackType",
            description: "a track",
            timesPlayed: 0
        });
        await track.save();

        try {
            res.send("Hello POST!");
=======
        try {
            res.send("Hello World!");
>>>>>>> 9278d1d65793fd789f4d94e156bbcf060598b2d1
        } catch (err) {
            res.status(ERR_500).send(err.message);
        }
};
