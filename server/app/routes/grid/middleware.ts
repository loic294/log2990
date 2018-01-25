import { Request, Response, NextFunction } from "express";

import GridGeneratorService from '../../services/gridGenerator'

// Test lexical service
export async function generate(req: Request, res: Response, next: NextFunction) {

	/*
		A middleware should only call a service and send back the content.
		Nothing else should be here.
	*/

	const gridGeneratorService = new GridGeneratorService()
	const grid = await gridGeneratorService.generate()

	res.json({ grid })
}