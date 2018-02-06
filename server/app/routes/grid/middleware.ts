import { Request, Response, NextFunction } from "express";

import GridGeneratorService from "../../services/gridGenerator/word-generator";
import { Case } from "../../../../common/grid/case";

// Test lexical service
export async function generate(req: Request, res: Response, next: NextFunction) {

    console.log("GENERATE GRID");

    const gridGeneratorService: GridGeneratorService = new GridGeneratorService();
	await gridGeneratorService.generateWords("easy");
	console.log();
    const grid: Case[][] = gridGeneratorService.getGrid();
    // console.log("GRID", grid);

    res.json({ 
		grid,
		horizontalWords: gridGeneratorService.horizontalWordArray,
		verticalWords: gridGeneratorService.verticalWordArray,
	});
}
