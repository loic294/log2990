import { Request, Response, NextFunction } from "express";
import Track, { ITrackInfo } from "../../models/trackInfo";

const MAX_TIMES: number = 5;

export const obtainTracks: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            const requestedTrack: string = req.query["name"];
            let tracks: ITrackInfo[];

            if (requestedTrack === "all") {
                tracks = await Track.find({}, { _id: 0, name: 1 }).exec();
            } else {
                tracks = await Track.find({ name: requestedTrack },
                                          { _id: 0, name: 1, type: 1, description: 1,
                                            timesPlayed: 1, vertice: 1, completedTimes: 1 }).exec();
            }
            res.json(tracks);
        } catch (error) {
            res.status(error).send(error.message);
        }

    };

export const saveTrack: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            const track: ITrackInfo = new Track({
                name: req.body["name"],
                type: req.body["type"],
                description: req.body["description"],
                timesPlayed: req.body["timesPlayed"],
                vertice: req.body["vertice"],
                completedTimes: req.body["completedTimes"]
            });
            await track.save();
            res.send("POST success.");
        } catch (error) {
            res.status(error).send(error.message);
        }

    };

export const deleteTrack: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            const requestedTrack: string = req.query["name"];
            if (requestedTrack === "all") {
                await Track.remove({}).exec();
            } else {
                await Track.remove({ name: requestedTrack }).exec();
            }
            res.send("DELETE success.");
        } catch (error) {
            res.status(error).send(error.message);
        }

    };

export const patchTrack: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            const requestedTrack: string = req.query["name"];
            const trackAttributes: ITrackInfo = new Track({
                name: req.body["name"],
                type: req.body["type"],
                description: req.body["description"],
                timesPlayed: req.body["timesPlayed"],
                vertice: req.body["vertice"],
                completedTimes: req.body["completedTimes"]
            });
            if (trackAttributes.completedTimes.length > MAX_TIMES) {
                trackAttributes.completedTimes.splice(0, MAX_TIMES);
            }

            await Track.update({ name: requestedTrack }, {
                $set: {
                    name: trackAttributes.name, type: trackAttributes.type,
                    description: trackAttributes.description,
                    timesPlayed: trackAttributes.timesPlayed,
                    vertice: trackAttributes.vertice,
                    completedTimes: trackAttributes.completedTimes
                }
            }).exec();
            res.send("PATCH success.");
        } catch (error) {
            res.status(error).send(error.message);
        }

    };
