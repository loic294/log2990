import { Request, Response, NextFunction } from "express";

export async function me(req: Request, res: Response, next: NextFunction) {
	res.json({ succes: true });
}
