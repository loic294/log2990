import { Request, Response, NextFunction } from "express";

export function me(req: Request, res: Response, next: NextFunction) {
	res.json({ succes: true })
}