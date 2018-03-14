import { Request, Response, NextFunction } from "express";

const ERR_500: number = 500;

export const obtainTracks: (req: Request, res: Response, next: NextFunction) => Promise<void> =
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            res.send("Hello World!");
        } catch (err) {
            res.status(ERR_500).send(err.message);
        }
};
