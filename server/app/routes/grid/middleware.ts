import { Request, Response, NextFunction } from "express";

// Test lexical service
export async function generate(req: Request, res: Response, next: NextFunction) {
	res.json({ success: true })
}