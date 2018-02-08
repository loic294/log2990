import { Request, Response, NextFunction } from "express";

import GridGeneratorService from '../../services/gridGenerator'

// Test lexical service
export async function generate(req: Request, res: Response, next: NextFunction) {

	const gridGeneratorService = new GridGeneratorService()

	const grid = await gridGeneratorService.generate()

	res.json({ grid })
}