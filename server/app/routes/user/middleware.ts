import { Request, Response, NextFunction } from "express";

export const me: (req: Request, res: Response, next: NextFunction) => void =
    async (req: Request, res: Response, next: NextFunction) => {
    res.json({ succes: true });

};
