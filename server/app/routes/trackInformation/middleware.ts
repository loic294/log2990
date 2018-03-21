import { Request, Response, NextFunction } from "express";
import Track, { ITrackInfo } from "../../models/trackInfo";

const ERR_500: number = 500;

export const obtainTracks: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const requestedTrack: string = req.query["name"];
        let tracks: ITrackInfo[];

        if (requestedTrack === "all") {
            tracks = await Track.find({}, {_id: 0, name: 1, type: 1, description: 1, timesPlayed: 1, vertice: 1}).exec();
            const trackNames: String[] = new Array();
            for (const track of tracks) {
                trackNames.push(track.name);
            }
            res.json(trackNames);
        } else {
            tracks = await Track.find({name: requestedTrack},
                                      {_id: 0, name: 1, type: 1, description: 1, timesPlayed: 1, vertice: 1}).exec();
            res.json(tracks);
        }
    };

export const saveTrack: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        const track: ITrackInfo = new Track({
            name: req.body["name"],
            type: req.body["type"],
            description: req.body["description"],
            timesPlayed: req.body["timesPlayed"],
            vertice: req.body["vertice"]
        });
        await track.save();

        try {
            res.send("Hello POST!");
        } catch (err) {
            res.status(ERR_500).send(err.message);
        }
    };

export const deleteTrack: (req: Request, res: Response, next: NextFunction) => Promise<void> =
async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const requestedTrack: string = req.query["name"];
    if (requestedTrack === "all") {
        await Track.remove({}).exec();
    } else {
        await Track.remove({name: requestedTrack}).exec();
    }

    try {
        res.send("Hello DELETE!");
    } catch (err) {
        res.status(ERR_500).send(err.message);
    }
};
